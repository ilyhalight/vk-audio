import type { VKAudioResult } from "./types";
import type { APIErrorResponse } from "./types/api/response";
import type {
  GetAudioData,
  GetAudioResponse,
  GetAudioSectionData,
  GetSectionResponse,
} from "./types/api/catalog";
import type {
  VKAudioOpts,
  VKAudioRefreshSettings,
  VKAudioToken,
} from "./types/audio";
import type { VKLang } from "./types/client";

import { isAPIError, isLang, isVKToken } from "./utils/guards";
import type { VKAudioMethod } from "./types/api";
import type {
  AudioItem,
  AudioSection,
  AudioSectionList,
} from "./types/client/section";
import {
  getAudioItem,
  getAudiosById,
  getTimestamp,
  returnError,
} from "./utils";
import type { BaseClient } from "./client";
import type { SectionBlockAudios } from "./types/api/blocks";
import type {
  GetSearchSuggestionsResponse,
  SearchAudioData,
  SearchAudioResponse,
} from "./types/api/audio/search";
import type { AddAudioResult, SearchAudioResult } from "./types/client/audio";
import type { AudioAddResponse, AudioAddResult } from "./types/api/audio/add";
import type {
  AudioDeleteResponse,
  AudioDeleteResult,
} from "./types/api/audio/delete";

const DEFAULT_LANG = "en";
/**
 * 10 minutes
 */
const DEFAULT_THRESHOLD = 600;

export class VKAudio {
  client: BaseClient;
  lang: VKLang;
  protected token: VKAudioToken;
  protected refreshSettings: VKAudioRefreshSettings;

  constructor({
    client,
    token,
    lang = DEFAULT_LANG,
    refreshThreshold = DEFAULT_THRESHOLD,
  }: VKAudioOpts) {
    if (client._name === "VKMobileClient" && !isVKToken(token.value)) {
      throw new Error(
        "Check passed 'token.value'. Looks like your token doesn't starts with 'vk1.'",
      );
    }

    this.client = client;
    this.token = token;
    this.refreshSettings = {
      enabled: token.expiresIn !== 0,
      threshold: refreshThreshold,
    };
    this.lang = isLang(lang) ? lang : DEFAULT_LANG;
  }

  get authParams() {
    return new URLSearchParams({
      v: this.client.version,
      access_token: this.token.value,
      lang: this.lang,
      client_id: this.client.id,
    }).toString();
  }

  async request<T>(
    method: VKAudioMethod,
    body?: URLSearchParams,
  ): Promise<VKAudioResult<T>> {
    try {
      if (
        this.refreshSettings.enabled &&
        this.token.expiresIn - getTimestamp() < this.refreshSettings.threshold
      ) {
        const newToken = await this.client.refresh();
        if (newToken.success) {
          // console.log("[DEBUG] Token has been refreshed!");
          const {
            data: { accessToken, expiresIn },
          } = newToken;
          this.token = {
            value: accessToken,
            expiresIn,
          };
        }
      }

      const res = await fetch(
        `${this.client.apiBase}${method}?${this.authParams}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent": this.client.userAgent,
          },
          body,
        },
      );

      const data = (await res.json()) as APIErrorResponse | T;
      if (isAPIError(data)) {
        throw new Error(data.error?.error_msg ?? `Failed to request ${method}`);
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        error: returnError(err),
      };
    }
  }

  createBody(data: Record<string, string | undefined>) {
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        body.append(key, value);
      }
    }

    return body;
  }

  /**
   * Get available sections raw data
   *
   * @param {string} [ownerId] - User or community id. If not specified, current user audios will be returned
   * @todo need_blocks param
   */
  async rawGetSections(ownerId?: string): Promise<GetAudioData> {
    const body = this.createBody({
      owner_id: ownerId,
    });

    const sections = await this.request<GetAudioResponse>(
      "catalog.getAudio",
      body,
    );
    if (!sections.success) {
      throw sections;
    }

    return sections.data.response.catalog;
  }

  /**
   * Get available sections
   *
   * @param {string} [ownerId] - User or community id. If not specified, current user audios will be returned
   * @todo need_blocks param
   */
  async getSections(ownerId?: string): Promise<AudioSectionList> {
    const { default_section: defaultSection, sections } =
      await this.rawGetSections(ownerId);

    return {
      defaultSection,
      sections,
    };
  }

  /**
   * Get section raw data
   *
   * @param {string} sectionId - Id of the section
   * @param {string} [startFrom] - Id of the offset
   */
  async rawGetSection(
    sectionId: string,
    startFrom?: string,
  ): Promise<GetAudioSectionData> {
    const body = this.createBody({
      section_id: sectionId,
      start_from: startFrom,
    });

    const section = await this.request<GetSectionResponse>(
      "catalog.getSection",
      body,
    );
    if (!section.success) {
      throw section;
    }

    return section.data.response;
  }

  /**
   * Get section
   *
   * @param {string} sectionId - Id of the section
   * @param {string} [startFrom] - Id of the offset
   */
  async getSection(
    sectionId: string,
    startFrom?: string,
  ): Promise<AudioSection> {
    const {
      section: { id, blocks, breadcrumbs, title, next_from: nextOffset, url },
      audios: dataAudios,
    } = await this.rawGetSection(sectionId, startFrom);
    const recentBlock = blocks?.find(
      (block) =>
        block.data_type === "music_audios" &&
        (block as SectionBlockAudios).url.includes("&block=recent"),
    );
    const audiosBlock = blocks?.find(
      (block) =>
        block.data_type === "music_audios" &&
        !(block as SectionBlockAudios).url.includes("&block=recent"),
    );
    const recentIds = (recentBlock as SectionBlockAudios)?.audios_ids || [];
    const audiosIds = (audiosBlock as SectionBlockAudios)?.audios_ids || [];

    const recentAudios: AudioItem[] = getAudiosById(dataAudios, recentIds);
    const audios: AudioItem[] = getAudiosById(dataAudios, audiosIds);

    return {
      id,
      breadcrumbs,
      title,
      nextOffset,
      url,
      audios,
      recentAudios,
    };
  }

  /**
   * Get search suggestions
   *
   * @param {string} query - Search query
   */
  async getSearchSuggestion(query: string): Promise<string[]> {
    const body = this.createBody({
      query,
    });

    const section = await this.request<GetSearchSuggestionsResponse>(
      "audio.getSearchSuggestions",
      body,
    );
    if (!section.success) {
      throw section;
    }

    return section.data.response.suggestions;
  }

  /**
   * Search audio
   *
   * @param {string} query - Search query
   * @param {number} [offset] - Offset for search results
   */
  async rawSearchAudio(
    query: string,
    offset?: number,
  ): Promise<SearchAudioData> {
    const body = this.createBody({
      q: query,
      offset: offset?.toString(),
    });

    const section = await this.request<SearchAudioResponse>(
      "audio.search",
      body,
    );
    if (!section.success) {
      throw section;
    }

    return section.data.response;
  }

  async searchAudio(
    query: string,
    offset?: number,
  ): Promise<SearchAudioResult> {
    const { count, items } = await this.rawSearchAudio(query, offset);
    const audios = items.map((audio) => getAudioItem(audio));
    return {
      count,
      audios,
    };
  }

  async rawAdd(ownerId: number, audioId: number): Promise<AudioAddResult> {
    const body = this.createBody({
      owner_id: ownerId.toString(),
      audio_id: audioId.toString(),
    });

    const res = await this.request<AudioAddResponse>("audio.add", body);
    if (!res.success) {
      throw res;
    }

    return res.data.response;
  }

  async add(ownerId: number, audioId: number): Promise<AddAudioResult> {
    const result = await this.rawAdd(ownerId, audioId);
    const addedAudio = result.items[0];
    if (!addedAudio) {
      throw new Error(
        `Failed to add audio ${ownerId}_${audioId}. No result returned`,
      );
    }

    return {
      audioId: addedAudio.new_audio_id,
      ownerId: addedAudio.new_owner_id,
    };
  }

  async rawDelete(
    ownerId: number,
    audioId: number,
  ): Promise<AudioDeleteResult> {
    const body = this.createBody({
      owner_id: ownerId.toString(),
      audio_id: audioId.toString(),
    });

    const res = await this.request<AudioDeleteResponse>("audio.delete", body);
    if (!res.success) {
      throw res;
    }

    return res.data.response;
  }

  async delete(ownerId: number, audioId: number): Promise<boolean> {
    const result = await this.rawDelete(ownerId, audioId);
    return result.audio_ids.some((id) => id === `${ownerId}_${audioId}`);
  }
}
