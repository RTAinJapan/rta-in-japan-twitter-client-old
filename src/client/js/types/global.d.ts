declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export type Tweets = {
  /** ツイートID */
  idStr: string;
  /** ユーザ名 */
  displayName: string;
  /** ユーザ名(@なんちゃら) */
  screenName: string;
  /** ツイート時刻 */
  dateStr: string;
  /** アイコンURL */
  icon: string;
  /** ツイート内容 */
  message: string;
};

export type PreviewFile = File & {
  preview: any;
};

export type Config = {
  /** Discordの設定 */
  discord: {
    /** サーバID */
    guild: string;
    /** 権限ID */
    roles: string[];
    /** この画面を操作できるユーザID。 */
    users: string[];
  };
};
