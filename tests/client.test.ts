import { describe, expect, test } from "bun:test";

import { VKWebClient } from "../src/client";
import type { VKClientRefreshData } from "../src/types/client";
import type { VKAudioSuccessResult } from "../src/types";

const ACCESS_TOKEN = Bun.env.VK_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  throw new Error("You should set VK_ACCESS_TOKEN in .env");
}

const COOKIE_P = Bun.env.VK_COOKIE_P;
const COOKIE_REMIX_SID = Bun.env.VK_COOKIE_REMIX_SID;
if (!(COOKIE_P && COOKIE_REMIX_SID)) {
  throw new Error("You should set COOKIE_P and COOKIE_REMIX_SID in .env");
}

describe("vk web", () => {
  test("authorize", async () => {
    const client = new VKWebClient({
      cookies: {
        p: COOKIE_P,
        remixsid: COOKIE_REMIX_SID,
      },
    });

    const result = await client.refresh();
    expect(result.success).toBe(true);
    const data = (result as VKAudioSuccessResult<VKClientRefreshData>).data;
    expect(data.accessToken).toStartWith("vk1.");
  });
});
