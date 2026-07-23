import type { AudioItem } from "./section";

export type SearchAudioResult = {
  count: number;
  audios: AudioItem[];
};

export type AddAudioResult = {
  audioId: number;
  ownerId: number;
};
