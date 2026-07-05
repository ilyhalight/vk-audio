import type { BaseClient } from "../client";
import type { VKLang } from "./client";

export type VKAudioToken = {
  /**
   * access_token
   */
  value: string;
  /**
   * set 0, to ignore refreshing
   *
   * accept unixtime as seconds
   */
  expiresIn: number;
};

export type VKAudioOpts = {
  client: BaseClient;
  token: VKAudioToken;
  lang?: VKLang;
  /**
   * Minimum remaining lifetime required before attempting a refresh
   *
   * in seconds
   */
  refreshThreshold?: number;
};

export type VKAudioRefreshSettings = {
  enabled: boolean;
  threshold: number;
};
