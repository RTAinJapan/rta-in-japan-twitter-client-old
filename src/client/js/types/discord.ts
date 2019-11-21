/**
 * ユーザ
 * @see https://discordapp.com/developers/docs/resources/user#user-object
 */
export type DiscordUser = {
  /** the user's id	identify */
  id: string;
  /** the user's username, not unique across the platform	identify */
  username: string;
  /** the user's 4-digit discord-tag	identify */
  discriminator: string;
  /** the user's avatar hash	identify */
  avatar?: string;
  /** whether the user belongs to an OAuth2 application	identify */
  bot?: boolean;
  /** whether the user has two factor enabled on their account	identify */
  mfa_enabled?: boolean;
  /** the user's chosen language option	identify */
  locale?: string;
  /** whether the email on this account has been verified	email */
  verified?: boolean;
  /** the user's email	email */
  email?: string;
  /** the flags on a user's account	identify */
  flags?: number;
  /** the type of Nitro subscription on a user's account	identify */
  premium_type?: number;
};

export type OAuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};
