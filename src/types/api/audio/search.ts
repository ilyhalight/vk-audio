import type { Audio } from ".";
import type { APISuccessResponse } from "../response";

export type GetSearchSuggestionsData = {
  suggestions: string[];
};

export type GetSearchSuggestionsResponse =
  APISuccessResponse<GetSearchSuggestionsData>;

export type SearchAudioData = {
  count: number;
  items: Audio[];
};

export type SearchAudioResponse = APISuccessResponse<SearchAudioData>;
