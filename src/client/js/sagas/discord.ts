import { DiscordUser, OAuthToken, DiscordGuild, DiscordGuildMember, DiscordPartialGuild } from '../types/discord';
import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { RootState } from '../reducers';

const baseUrl = 'https://discordapp.com/api/v6';
const clientId = '627778242727641088';
const clientSecret = '';
const redirectUrl = 'http://localhost:8080/login/discord';
const scope = 'identify%20guilds';

/** Discord認証でトークンをもらうページに遷移する */
export const oauthDiscord = async () => {
  const state = Math.random() * 100000000;
  const url = `https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=${clientId}&state=${state}&scope=${scope}`;
  window.location.replace(url);
};

/** Discordの認証コードを基に、トークンを取得して保存する */
export const saveToken = async (): Promise<boolean> => {
  const code = localStorage.getItem('code');
  if (!code) return false;

  const result = await getAccessToken(code);
  if (!result) {
    // コードがあるのに取得に失敗したということは、通信エラーか無効なコードになっている
    localStorage.removeItem('code');
    return false;
  }
  localStorage.setItem('discordToken', result.access_token);
  localStorage.setItem('refreshToken', result.refresh_token);
  return true;
};

/**
 * 認証後のcodeからアクセストークンを得る
 * @param code
 */
const getAccessToken = async (code: string): Promise<OAuthToken | null> => {
  try {
    const url = `${baseUrl}/oauth2/token`;

    const body = {
      scope,
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: encodeURIComponent(redirectUrl),
    };

    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.entries(body)
        .map(obj => obj.join('='))
        .join('&'),
    });
    return await result.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * DiscordAPI共通処理
 * @params api APIのパス
 * @returns APIの結果。何か問題あったらnull
 */
const discordApi = async (api: string) => {
  try {
    const token = localStorage.getItem('discordToken');
    if (!token) throw new Error('トークンエラー');
    const url = `${baseUrl}${api}`;

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.status >= 400) throw new Error();
    return await result.json();
  } catch (error) {
    return null;
  }
};

export function* loginCheck() {
  try {
    const state: RootState = yield select();
    const config = state.reducer.config;

    let token = localStorage.getItem('discordToken');
    if (!token) {
      yield call(saveToken);
      token = localStorage.getItem('discordToken');
    }

    if (token) {
      yield put(actions.changeNotify(true, 'info', 'ユーザ情報を取得しています。'));
      // ユーザ情報を取得
      const user: DiscordUser = yield call(getCurrentUser);
      const userGuild: DiscordGuild[] = yield call(getUserGuild);
      const guild = userGuild.filter(guild => guild.id === config.discord.guild);
      if (guild.length === 0) throw new Error('このユーザは規定のサーバに所属していません。');
      if (!config.discord.users.includes(user.id)) throw new Error('操作権限がありません。');

      yield put(actions.storeDiscordUserName(user.username));
      yield put(actions.changeNotify(true, 'info', `ユーザ名：${user.username}`));
    } else {
      yield call(logoutDiscord);
    }
  } catch (e) {
    yield put(actions.changeDialog({ show: true, type: 'error', message: e.message }));
    yield call(logoutDiscord);
  }
}

/** ログアウト処理 */
export function* logoutDiscord() {
  localStorage.removeItem('code');
  localStorage.removeItem('discordToken');
  localStorage.removeItem('discordExpire');
  localStorage.removeItem('discordState');
  yield put(actions.storeDiscordUserName(null));
}

/** ログイン中のユーザ情報を取得 */
export const getCurrentUser = (): Promise<DiscordUser> => discordApi('/users/@me');

/** 指定したサーバの情報を取得 */
export const getGuild = (guildId: string): Promise<DiscordGuild> => discordApi(`/guilds/${guildId}`);

export const getUserGuild = (): Promise<DiscordPartialGuild[]> => discordApi('/users/@me/guilds');

export const getGuildMember = (guildId: string, userId: string): Promise<DiscordGuildMember> => discordApi(`/guilds/${guildId}/members/${userId}`);
