import { DiscordUser, OAuthToken } from '../types/discord';
import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';

const baseUrl = 'https://discordapp.com/api/v6';
const clientId = '627778242727641088';
const clientSecret = 'QqZZjONOIyH4XnqlbexKgr_pFbBkeULV';
const redirectUrl = 'http://localhost:8080/login/discord';
const scope = 'identify';

/** Discord認証でトークンをもらうページに遷移する */
export const oauthDiscord = () => {
  const url = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${scope}`;
  window.location.replace(url);
};

/** Discordの認証コードがあればトークンを取得して保存する */
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
    return await result.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export function* loginCheck() {
  let token = localStorage.getItem('discordToken');
  if (!token) yield call(saveToken);
  token = localStorage.getItem('discordToken');

  if (token) {
    const user: DiscordUser = yield call(getCurrentUser);
    yield put(actions.storeDiscordUserName(user.username));
    yield put(actions.changeNotify(true, 'info', `ユーザ名：${user.username}`));
  }
}

/** ログアウト処理 */
export function* logoutDiscord() {
  localStorage.removeItem('code');
  localStorage.removeItem('discordToken');
  yield put(actions.storeDiscordUserName(null));
}

/** ログイン中のユーザ情報を取得 */
export const getCurrentUser = (): Promise<DiscordUser> => discordApi('/users/@me');
