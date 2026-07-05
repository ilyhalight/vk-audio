import type { Audio } from "./audio";
import type { Playlist } from "./audio/playlist";
import type { SectionBlock } from "./blocks";
import type { Group } from "./group";
import type { Link } from "./link";
import type { Profile } from "./profile";
import type { APISuccessResponse } from "./response";

export type CatalogMethod = "catalog.getAudio" | "catalog.getSection";
export type CatalogBaseResponse<T> = Record<"catalog", T>;

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

export type GetAudioData = {
  default_section: string;
  sections: MinimalAudioSection[];
  /**
   * @only in web client
   */
  buttons?: unknown[];
};

export type GetAudioResponse = APISuccessResponse<
  CatalogBaseResponse<GetAudioData>
>;

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
