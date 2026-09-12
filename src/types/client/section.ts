import type { PlaylistType } from "../api/audio/playlist";
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
  id?: string;
};

export type AudioItem = {
  id: number;
  ownerId: number;
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
  artists: Artist[];
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

export type AudioMix = {
  /**
   * "common" for vk mix
   */
  id: string;
  description: string;
  /**
   * lottie background animation json url
   */
  lottieBgUrl?: string;
  isTunable: boolean;
  titles: {
    common: string;
    play: string;
  };
};

export type PlaylistItemOriginal = {
  playlistId: number;
  ownerId: number;
  accessKey: string;
};

export type PlaylistItemFollowed = {
  playlistId: number;
  ownerId: number;
};

export type PlaylistItem = {
  id: number;
  ownerId: number;
  type: PlaylistType;
  title: string;
  description: string;
  /**
   * count of audios inside playlist
   */
  count: number;
  followers: number;
  plays: number;
  /**
   * unixtime in secods format
   */
  createdAt: number;
  /**
   * unixtime in secods format
   */
  updatedAt: number;
  genres: unknown[];
  isFollowing: boolean;
  photo: Thumbail;
  thumbs: Thumbail[];
  accessKey: string;
  original?: PlaylistItemOriginal;
  followed?: PlaylistItemFollowed;
  /**
   * hex color
   */
  mainColor?: string;
  subtitle?: string;
};

export type AudioSectionListWithBlocks = AudioSectionList & {
  audioMixes: AudioMix[];
  recentAudios: AudioItem[];
  playlists: PlaylistItem[];
};
