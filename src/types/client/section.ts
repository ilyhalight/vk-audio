import type { Thumbail } from "../api/audio/thumbnail";
import type { Breadcrumb } from "../api/catalog";

export type Album = {
  id: number;
  ownerId: number;
  title: string;
  thumbnail: Thumbail;
  /**
   * hex color
   */
  mainColor: string;
};

export type Artist = {
  name: string;
  id: string;
};

export type AudioItem = {
  id: number;
  /**
   * seconds
   */
  duration: number;
  title: string;
  /**
   * e.g. hardstyle, speed up and etc
   */
  subtitle?: string;
  artist: string;
  artists?: Artist[];
  isExplicit: boolean;
  isLiked: boolean;
  hasLyrics: boolean;
  fileUrl: string;
  thumbnail: Thumbail;
  album?: Album;
  createdAt: number;
};

export type MinimalAudioSection = {
  id: string;
  title: string;
  url: string;
};

export type AudioSection = MinimalAudioSection & {
  breadcrumbs?: Breadcrumb[];
  nextOffset?: string;
  audios: AudioItem[];
  recentAudios?: AudioItem[];
};

export type AudioSectionList = {
  defaultSection: string;
  sections: MinimalAudioSection[];
};
