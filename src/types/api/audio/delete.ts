import type { APISuccessResponse } from "../response";

export type AudioDeleteResult = {
  audio_ids: string[];
};

export type AudioDeleteResponse = APISuccessResponse<AudioDeleteResult>;
