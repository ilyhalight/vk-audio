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
  describe("raw", () => {
    test("current user", async () => {
      const result = await client.rawGetSections();
      expect(result.sections.length).toBeGreaterThan(0);
      const myMusic = result.sections.find(
        (section) => section.title === "My music",
      );
      expect(myMusic).not.toBe(undefined);
    });
    test("with blocks", async () => {
      const result = await client.rawGetSections(undefined, true);
      const sections = result.catalog.sections;
      expect(sections.length).toBeGreaterThan(0);
      const myMusic = sections.find((section) => section.title === "My music");
      expect(myMusic).not.toBe(undefined);
      expect(result.audio_stream_mixes.length).toBeGreaterThan(0);
      expect(result.playlists.length).toBeGreaterThan(0);
    });
  });
  describe("wrapper", () => {
    test("with ownerId", async () => {
      const result = await client.getSections("612495802");
      expect(result.sections.length).toBeGreaterThan(0);
      expect(
        result.sections.find((section) => section.title === "Music"),
      ).not.toBe(undefined);
    });
    test("with blocks", async () => {
      const result = await client.getSectionsWithBlocks();
      expect(result.sections.length).toBeGreaterThan(0);
      expect(
        result.sections.find((section) => section.title === "My music"),
      ).not.toBe(undefined);
      expect(result.audioMixes.length).toBeGreaterThan(0);
      expect(result.playlists.length).toBeGreaterThan(0);
      expect(result.playlists[0]?.ownerId).not.toBe(undefined);
      expect(result.audioMixes[0]?.isTunable).not.toBe(undefined);
    });
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
    for (const audio of result.audios) {
      expect(
        audio.artists.length,
        "wrapper should returns not empty artists field",
      ).toBeGreaterThan(0);
    }
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
    expect(result.items.length).toBeGreaterThan(0);
  });
  test("[wrapper]", async () => {
    const result = await client.searchAudio("Imagine Dragons");
    expect(result.audios.length).toBeGreaterThan(0);
  });
  test("[wrapper] should returns artists without main_artists", async () => {
    const title = "レビテト / LOL feat. 重音テトSV";
    const result = await client.searchAudio(title);
    expect(result.audios.length).toBeGreaterThan(0);

    const audioItem = result.audios.find(
      (audio) => audio.artist === "PPP Sounds" && audio.title === title,
    );
    expect(audioItem).not.toBe(undefined);
    if (!audioItem) {
      return;
    }

    expect(audioItem.artists.length).toBeGreaterThan(0);
  });
});

describe("add/delete audio", () => {
  test("[raw]", async () => {
    const result = await client.rawAdd(591523674, 456239125);
    expect(result.items_count).toBeGreaterThan(0);
    const newAudio = result.items[0];
    expect(newAudio).not.toBe(undefined);
    const deleteResult = await client.rawDelete(
      newAudio!.new_owner_id,
      newAudio!.new_audio_id,
    );
    expect(deleteResult.audio_ids.length).toBeGreaterThan(0);
  });
  test("[wrapper]", async () => {
    const result = await client.add(591523674, 456239125);
    expect(result).not.toBe(undefined);
    const deleteResult = await client.delete(result.ownerId, result.audioId);
    expect(deleteResult).toBe(true);
  });
});
