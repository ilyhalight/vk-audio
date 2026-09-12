import type { Audio } from "./audio";
import type { Playlist } from "./audio/playlist";
import type { SectionBlock } from "./blocks";
import type { Group } from "./group";
import type { Link } from "./link";
import type { Profile } from "./profile";
import type { APISuccessResponse } from "./response";

export type CatalogMethod = "catalog.getAudio" | "catalog.getSection";

export type Breadcrumb = {
  label: string;
};

export type SectionActionItem = {
  action: {
    type: string;
    style: string;
  };
  ref_items_count: number;
  ref_layout_name: string;
  ref_data_type: string;
};

export type MinimalAudioSection = {
  id: string;
  title: string;
  /**
   * always(?) starts with "https://vk.com/audios"
   */
  url: string;
};

export type AudioSection = MinimalAudioSection & {
  breadcrumbs?: Breadcrumb[];
  blocks?: SectionBlock[];
  /**
   * ID offset
   * @api used as `start_from` param
   */
  next_from?: string;
  actions?: SectionActionItem[];
};

export type AudioDataButtonActionType =
  | "add_playlist"
  | "music_transfer"
  | "upload_audio";

export type AudioDataButtonAction = {
  type: AudioDataButtonActionType;
  style: "default";
};

export type AudioDataButton = {
  action: AudioDataButtonAction;
  owner_id: number;
  /**
   * raw i18n phrase, e.g. `audio_music_transfer`
   */
  title: string;
};

export type GetAudioData = {
  default_section: string;
  sections: MinimalAudioSection[];
  /**
   * @only in web client
   */
  buttons?: AudioDataButton[];
};

export type GetAudioResponse = APISuccessResponse<
  Record<"catalog", GetAudioData>
>;

export type AudioStreamMix = {
  /**
   * "common" for vk mix
   */
  id: string;
  description: string;
  /**
   * lottie background animation json url
   */
  background_animation_url: string;
  is_tunable: boolean;
  titles: {
    common_state: string;
    play_state: string;
  };
  stream_mix: {
    /**
     * "common" for vk mix
     */
    id: string;
    title: string;
  };
};

export type AudioWithBlocksData = {
  catalog: GetAudioData;
  audio_stream_mixes: AudioStreamMix[];
  profiles: Profile[];
  /**
   * last played
   */
  audios: Audio[];
  playlists: Playlist[];
};

export type GetAudioWithBlocksResponse =
  APISuccessResponse<AudioWithBlocksData>;

export type MinimalAudioSectionData = {
  section: AudioSection;
  audios: Audio[];
};

/**
 * availabled if `start_from` is undefined
 */
export type StartAudioSectionData = {
  profiles: Profile[];
  groups: Group[];
  links: Link[];
  playlists: Playlist[];
};

export type GetAudioSectionData = MinimalAudioSectionData &
  Partial<StartAudioSectionData>;

export type GetSectionResponse = APISuccessResponse<GetAudioSectionData>;
