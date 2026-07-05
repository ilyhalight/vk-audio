export const SectionDataType = {
  None: "none",
  MusicAudios: "music_audios",
  MusicPlaylists: "music_playlists",
  Links: "links",
} as const;

export type SectionDataType =
  (typeof SectionDataType)[keyof typeof SectionDataType];

export type SectionBlockLayout =
  | {
      /**
       * i guess its element name
       */
      name: string;
      title: string;
    }
  | {
      /**
       * e.g.: separator
       */
      name: "separator";
      style: "island";
    }
  | {
      /**
       * e.g: large_slider
       */
      name: "large_slider";
      owner_id: number;
    };

export type SectionBlockActionWrapperItem = {
  type: "open_section";
  target: "internal";
  url: string;
  style: "default";
};

export type SectionBlockActionWrapper = {
  action: unknown;
  section_id: string;
  title: string;
  ref_items_count: number;
  /**
   * e.g.: "triple_stacked_slider"
   */
  ref_layout_name: string;
  /**
   * e.g: "music_audios"
   */
  ref_data_type: string;
};

export type SectionBlockMetaitem = {
  title: string;
  section_id: string;
};

export type SectionBlockMeta = Record<string, SectionBlockMetaitem>;

export type MinimalSectionBlock = {
  id: string;
  /**
   * @type SectionDataType
   * e.g: "none" | "music_audios" | "links"
   */
  data_type: SectionDataType;
  layout: SectionBlockLayout;
  title: string;
  actions?: SectionBlockActions;
};

export type SectionBlockActions = SectionBlockActionWrapper[];

export type SectionBlockAudios = MinimalSectionBlock & {
  data_type: "music_audios";
  next_from: string;
  url: string;
  meta: SectionBlockMeta;
  audios_ids: string[];
  actions: SectionBlockActions;
};

export type SectionBlockPlaylists = MinimalSectionBlock & {
  data_type: "music_playlists";
  next_from: string;
  url: string;
  listen_events: string[];
  playlists_ids: string[];
};

/**
 * also for friends music
 */
export type SectionBlockLinks = MinimalSectionBlock & {
  data_type: "links";
  next_from: string;
  url: string;
  listen_events: string[];
  links_ids: string[];
};

export type SectionBlockBadgeItem = {
  /**
   * e.g.: transparent
   */
  type: string;
  text: string;
};

export type SectionBlockBadge = MinimalSectionBlock & {
  badge: SectionBlockBadgeItem;
};

export type SectionBlock =
  | MinimalSectionBlock
  | SectionBlockAudios
  | SectionBlockPlaylists
  | SectionBlockLinks
  | SectionBlockBadge;
