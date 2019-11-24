import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { Tweets, PreviewFile, Config } from '../types/global';
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
  list: {
    /** 自分の結果 */
    self: Tweets[];
    /** ハッシュタグで検索した結果 */
    hash: Tweets[];
    /** ワード検索の結果 */
    search: Tweets[];
  };
  post: {
    media: PreviewFile[];
  };
  /** 設定ファイルの内容 */
  config: Config;
};

export type RootState = {
  reducer: GlobalState;
};

const tweet = {
  idStr: '1212',
  icon: './images/rtainjapan-icon.png',
  message: 'あいうえおあいうえおあいうえおあいうえおあいうえお\nかきくけこnかきくけこ',
  dateStr: '2019',
  displayName: 'RTA走り太郎',
  screenName: 'rta_runner',
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
  list: {
    self: [tweet, tweet, tweet, tweet, tweet, tweet, tweet, tweet],
    hash: [tweet],
    search: [],
  },
  post: {
    media: [],
  },
  config: {
    discord: {
      guild: '',
      roles: [],
      users: [],
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
      return { ...state, notify: { ...initial.notify } };
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
        list: {
          ...state.list,
          [action.payload.type]: action.payload.list,
        },
      };
    }
    case getType(actions.storeMedia): {
      return {
        ...state,
        post: {
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
    default:
      return state;
  }
};

export default combineReducers({ reducer });
