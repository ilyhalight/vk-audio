import type { AudioAd } from "./ad";
import type { Thumbail } from "./thumbnail";

export type AudioMethod = "audio.getSearchSuggestions" | "audio.search";

export type Album = {
  id: number;
  title: string;
  owner_id: number;
  access_key: string;
  thumb: Thumbail;
  /**
   * hex color
   */
  main_color: string;
};

export type Artist = {
  name: string;
  domain: string;
  id: string;
  is_followed?: boolean;
  can_follow?: boolean;
};

export type Audio = {
  artist: string;
  id: number;
  owner_id: number;
  title: string;
  /**
   * seconds
   */
  duration: number;
  subtitle?: string;
  access_key: string;
  ads: AudioAd;
  is_explicit: boolean;
  is_focus_track: boolean;
  is_licensed: boolean;
  track_code: string;
  /**
   * m3u8 file link
   */
  url: string;
  date: number;
  like: boolean;
  album: Album;
  main_artists?: Artist[];
  featured_artists?: Artist[];
  release_audio_id?: string;
  /**
   * hex color
   */
  main_color: string;
  genre_id?: number;
  thumb: Thumbail;
  has_lyrics?: true;
  permissions?: Record<"edit", boolean>;
  short_videos_allowed?: boolean;
  stories_allowed?: boolean;
  stories_cover_allowed?: boolean;
};
