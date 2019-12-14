import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { Tweets, PreviewFile, Config, Game } from '../types/global';
type Action = ActionType<typeof actions>;

export type DialogState = {
  /** ダイアログ表示 */
  show: boolean;
  /** 確認ダイアログか否か */
  confirm: boolean;
  /** ダイアログ種別 */
  type: 'info' | 'warning' | 'error';
  /** 簡潔に表すメッセージ */
  message: string;
  /** テキストボックスとかで表示したい詳細 */
  detail: string;
};

export type GlobalState = {
  /** 通知欄 */
  notify: {
    show: boolean;
    type: 'info' | 'warning' | 'error';
    message: string;
  };
  /** Discord */
  discord: {
    username: string | null;
    token: string | null;
  };
  /** ダイアログ */
  dialog: DialogState;
  /** ツイート一覧 */
  twitterTimeline: {
    /** 自分の結果 */
    user: Tweets[];
    /** メンションの結果 */
    mention: Tweets[];
    /** ハッシュタグで検索した結果 */
    hash: Tweets[];
  };
  /** Twitterに投稿する内容 */
  post: {
    text: string;
    media: {
      media_id_string: string;
      file: PreviewFile;
    }[];
  };
  /** ゲーム情報 */
  game: Game[];
  /** 設定ファイルの内容 */
  config: Config;
};

export type RootState = {
  reducer: GlobalState;
};

const initial: GlobalState = {
  // 通知欄
  notify: {
    show: false,
    type: 'info',
    message: '',
  },
  dialog: {
    show: false,
    confirm: false,
    type: 'info',
    message: '',
    detail: '',
  },
  discord: {
    username: null,
    token: null,
  },
  twitterTimeline: {
    user: [],
    mention: [],
    hash: [],
  },
  post: {
    text: '',
    media: [],
  },
  game: [],
  config: {
    api: {
      twitterBase: '',
      runner: '',
    },
    discord: {
      config: {
        baseUrl: '',
        clientId: '',
        clientSecret: '',
        redirectUrl: '',
        scope: '',
      },
      guild: '',
      roles: [],
      users: [],
    },
    tweetTemplate: {
      text: [],
      footer: '',
    },
  },
};

const reducer = (state: GlobalState = initial, action: Action): GlobalState => {
  switch (action.type) {
    case getType(actions.storeConfig): {
      return { ...state, config: action.payload };
    }
    // 通知
    case getType(actions.changeNotify): {
      return { ...state, notify: { ...action.payload } };
    }
    case getType(actions.closeNotify): {
      return { ...state, notify: { ...state.notify, show: false } };
    }
    // ダイアログ
    case getType(actions.changeDialog): {
      return { ...state, dialog: { ...state.dialog, ...action.payload } };
    }
    case getType(actions.closeDialog): {
      return { ...state, dialog: { ...initial.dialog } };
    }
    // ツイートを取得
    case getType(actions.updateTweetList): {
      return {
        ...state,
        twitterTimeline: {
          ...state.twitterTimeline,
          [action.payload.type]: action.payload.list,
        },
      };
    }
    case getType(actions.updateTweetText): {
      return {
        ...state,
        post: {
          ...state.post,
          text: action.payload,
        },
      };
    }
    case getType(actions.storeMedia): {
      return {
        ...state,
        post: {
          ...state.post,
          media: action.payload,
        },
      };
    }
    // Discordユーザ名
    case getType(actions.storeDiscordUserName): {
      return {
        ...state,
        discord: {
          ...state.discord,
          username: action.payload,
        },
      };
    }
    case getType(actions.updateGameList): {
      return {
        ...state,
        game: action.payload,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ reducer });
