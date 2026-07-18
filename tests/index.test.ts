import { beforeAll, describe, expect, test } from "bun:test";

import { VKAudio } from "../src";
import { VKWebClient } from "../src/client";
import type { VKAudioOpts } from "../src/types/audio";

const CLIENT_LANG = "en" as const;
const COOKIE_P = Bun.env.VK_COOKIE_P;
const COOKIE_REMIX_SID = Bun.env.VK_COOKIE_REMIX_SID;
if (!(COOKIE_P && COOKIE_REMIX_SID)) {
  throw new Error("You should set COOKIE_P and COOKIE_REMIX_SID in .env");
}

const webClient = new VKWebClient({
  cookies: {
    p: COOKIE_P,
    remixsid: COOKIE_REMIX_SID,
  },
});

const clientOpts: VKAudioOpts = {
  client: webClient,
  token: {
    value: "",
    expiresIn: -1,
  },
  lang: CLIENT_LANG,
};

const client = new VKAudio(clientOpts);

describe("get sections", () => {
  test("[raw] current user", async () => {
    const result = await client.rawGetSections();
    expect(result.sections.length).toBeGreaterThan(0);
    const myMusic = result.sections.find(
      (section) => section.title === "My music",
    );
    expect(myMusic).not.toBe(undefined);
  });
  test("[wrapper] with ownerId", async () => {
    const result = await client.getSections("612495802");
    expect(result.sections.length).toBeGreaterThan(0);
    expect(
      result.sections.find((section) => section.title === "Music"),
    ).not.toBe(undefined);
  });
});

describe("get section", () => {
  let myMusicId: string | undefined;
  const TEST_SECTION_TITLE = "My music";

  beforeAll(async () => {
    const sections = await client.rawGetSections();
    myMusicId = sections.sections.find(
      (section) => section.title === TEST_SECTION_TITLE,
    )?.id;
    console.log("obtained my music id");
  });

  test("[raw]", async () => {
    if (!myMusicId) {
      throw new Error("Failed to get my music id for these test case!");
    }

    const result = await client.rawGetSection(myMusicId);
    expect(result.section.title === TEST_SECTION_TITLE);
  });

  test("[wrapper]", async () => {
    if (!myMusicId) {
      throw new Error("Failed to get my music id for these test case!");
    }

    const result = await client.getSection(myMusicId);
    expect(result.title === TEST_SECTION_TITLE);
    expect(result.audios.length).toBeGreaterThan(1);
  });
});

test("get search suggestions [wrapper]", async () => {
  const suggestions = await client.getSearchSuggestion("Imagine Dragons");
  console.log(JSON.stringify(suggestions));
  expect(suggestions.length).toBeGreaterThan(0);
});

describe("search audio", () => {
  test("[raw]", async () => {
    const result = await client.rawSearchAudio("Imagine Dragons");
    expect(result.items.length).toBeGreaterThan(0);
  });
  test("[raw] with offset", async () => {
    const result = await client.rawSearchAudio("Imagine Dragons", 100);
    console.log(result);
    expect(result.items.length).toBeGreaterThan(0);
  });
  test("[wrapper]", async () => {
    const result = await client.searchAudio("Imagine Dragons");
    expect(result.audios.length).toBeGreaterThan(0);
  });
});
