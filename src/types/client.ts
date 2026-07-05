export type VKClientEditable = {
  version: string;
  apiBase: string;
};

export type VKClient = VKClientEditable & {
  readonly id: string;
  readonly secret: string;
  readonly userAgent: string;
};

export type VKMobileClientOpts = Partial<VKClientEditable>;
export type VKLang = "en" | "ru";

export type VKWebRequiredCookie = {
  p: string;
  remixsid: string;
};

export type VKWebClientOpts = Partial<VKClientEditable> & {
  cookies: VKWebRequiredCookie;
};

export type VKWebTokenData = {
  access_token: string;
  expires: number;
  user_id: number;
  logout_hash: string;
};

export type VKWebTokenSuccessResponse = {
  type: "okay";
  data: VKWebTokenData;
};

export type VKWebTokenErrorResponse = {
  type: "error";
  error_code: string;
  /**
   * "unauthorized"
   */
  error_info: string;
};

export type VKWebTokenResponse =
  | VKWebTokenErrorResponse
  | VKWebTokenSuccessResponse;

export type VKClientRefreshData = {
  accessToken: string;
  /**
   * unixtime in seconds
   */
  expiresIn: number;
};
