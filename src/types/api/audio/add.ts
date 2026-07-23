import type { APISuccessResponse } from "../response";

export type AudioAddResultItem = {
  new_audio_id: number;
  audio_raw_id: string;
  new_owner_id: number;
};

export type AudioAddResult = {
  items_count: number;
  errors_count: number;
  items: AudioAddResultItem[];
  errors: unknown[];
};

export type AudioAddResponse = APISuccessResponse<AudioAddResult>;
