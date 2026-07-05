import type { Thumbail } from "./thumbnail";

export type PlaylistPerms = {
  play: boolean;
  share: boolean;
  edit: boolean;
  follow: boolean;
  delete: boolean;
  boom_download: boolean;
  save_as_copy: boolean;
};

export type PlaylistOriginal = {
  playlist_id: number;
  owner_id: number;
  access_key: string;
};

export type PlaylistFollowed = {
  playlist_id: number;
  owner_id: number;
};

/**
 * ugc - user generated content
 * generated - by server-side logic
 */
export type PlaylistType = "ugc" | "generated";

export type Playlist = {
  id: number;
  owner_id: number;
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
  create_time: number;
  /**
   * unixtime in secods format
   */
  update_time: number;
  genres: unknown[];
  is_following: boolean;
  photo: Thumbail;
  permissions: PlaylistPerms;
  subtitle_badge: boolean;
  play_button: boolean;
  thumbs: Thumbail[];
  access_key: string;
  original?: PlaylistOriginal;
  followed?: PlaylistFollowed;
  /**
   * hex color
   */
  main_color?: string;
  subtitle?: string;
  meta?: Record<"view", "compact">;
};
