declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export type ArrayItem<T extends any[]> = T extends (infer Titem)[] ? Titem : never;
export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type GeneratorType<T extends (...args: any) => any> = ResolvedType<ReturnType<T>>;

export type TwitterAPI<T> = {
  code: number;
  data: T;
  error?: {
    message: string;
  };
};

export type Tweets = {
  /** ツイートID */
  id_str: string;
  text: string;
  user: {
    created_at: string;
    id_str: string;
    name: string;
    screen_name: string;
    profile_image_url_https: string;
  };
};

type Runner = {
  username: string;
  twitterid: string;
};
type Commentary = Runner;

export type Game = {
  id: number;
  gamename: string;
  category: string;
  runner: Runner[];
  commentary: Commentary[];
};

export type PreviewFile = File & {
  preview: any;
};

export type Config = {
  /** APIの設定 */
  api: {
    /** TwitterAPIのURL */
    twitterBase: string;
    /** 走者情報APIのURL */
    runner: string;
  };
  /** Discordの設定 */
  discord: {
    config: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
      redirectUrl: string;
      scope: string;
    };
    /** サーバID */
    guild: string;
    /** 権限ID */
    roles: string[];
    /** この画面を操作できるユーザID。 */
    users: string[];
  };
  tweetTemplate: {
    text: string[];
    footer: string;
  };
};
