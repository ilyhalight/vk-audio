import type { VKAudioResult } from "./types";
import type {
  VKClient,
  VKClientRefreshData,
  VKMobileClientOpts,
  VKWebClientOpts,
  VKWebTokenResponse,
} from "./types/client";
import { returnError } from "./utils";

const DEFAULT_VERSION = "5.282";
const DEFAULT_API_BASE = "https://api.vk.ru/method/";

export class BaseClient implements VKClient {
  readonly _name: string = "BaseClient";
  readonly id: string = "";
  readonly secret: string = "";
  readonly userAgent: string = "";

  version = DEFAULT_VERSION;
  apiBase = DEFAULT_API_BASE;

  authBase: string | null = null;
  authCookie: string = "";

  constructor(opts?: VKMobileClientOpts) {
    if (!opts) {
      return;
    }

    const { version, apiBase } = opts;
    this.version = version ?? this.version;
    this.apiBase = apiBase ?? this.apiBase;
  }

  async refresh(): Promise<VKAudioResult<VKClientRefreshData>> {
    return {
      success: false,
      error: returnError("Not implemented"),
    };
  }
}

export class VKMobileClient extends BaseClient {
  override readonly _name: string = "VKMobileClient";
  override readonly id = "6287487";
  override readonly secret = "hHbZxrka2uZ6jB1inYsH";
  override readonly userAgent =
    "VKAndroidApp/4.13.1-1206 (Android 4.4.3; SDK 19; armeabi; ; ru)";
}

export class VKWebClient extends BaseClient {
  override readonly _name: string = "VKWebClient";
  override readonly id = "6287487";
  override readonly userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:153.0) Gecko/20100101 Firefox/153.0";

  override authBase = "https://login.vk.ru/?act=web_token";
  override authCookie: string;

  origin = "https://vk.ru";
  referer = "https://vk.ru/";

  constructor(opts: VKWebClientOpts) {
    super(opts);
    const { p, remixsid } = opts.cookies;
    this.authCookie = `p=${p}; remixsid=${remixsid}`;
  }

  override async refresh(): Promise<VKAudioResult<VKClientRefreshData>> {
    try {
      const result = await fetch(this.authBase, {
        method: "POST",
        headers: {
          "user-agent": this.userAgent,
          "content-type": "application/x-www-form-urlencoded",
          origin: this.origin,
          referer: this.referer,
          cookie: this.authCookie,
        },
        body: new URLSearchParams({
          version: "1",
          app_id: this.id,
        }),
      });

      const data = (await result.json()) as VKWebTokenResponse;
      if (data.type === "error") {
        throw new Error(
          `Failed to refresh VKWebClient token, because: ${data.error_info}`,
        );
      }

      const {
        data: { access_token: accessToken, expires: expiresIn },
      } = data;

      return {
        success: true,
        data: {
          accessToken,
          expiresIn,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: returnError(err),
      };
    }
  }
}
