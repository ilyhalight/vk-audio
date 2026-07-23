import type { Audio } from "../types/api/audio";
import type { AudioItem } from "../types/client/section";

export const returnError = (error: unknown) =>
  Error.isError(error) ? error : new Error((error as string).toString());

export const getTimestamp = () => Math.floor(Date.now() / 1000);

export const getAudioItem = (audio: Audio) => {
  const {
    id,
    owner_id: ownerId,
    artist,
    main_artists,
    duration,
    title,
    album,
    subtitle,
    is_explicit: isExplicit,
    has_lyrics: hasLyrics,
    like: isLiked,
    url: fileUrl,
    thumb: thumbnail,
    date: createdAt,
  } = audio;

  return {
    id,
    ownerId,
    duration,
    artist,
    subtitle,
    artists: main_artists?.length
      ? main_artists.map((art) => ({
          name: art.name,
          id: art.id,
        }))
      : undefined,
    title,
    isExplicit,
    hasLyrics: hasLyrics === true,
    isLiked,
    fileUrl,
    album: album
      ? {
          id: album.id,
          ownerId: album.owner_id,
          title: album.title,
          thumbnail: album.thumb,
          mainColor: album.main_color,
        }
      : undefined,
    thumbnail,
    createdAt,
  } satisfies AudioItem;
};

export const getAudiosById = (dataAudios: Audio[], audioIds: string[]) => {
  return audioIds
    .map((recentId) => {
      const [ownerId, id] = recentId.split("_");
      const audio = dataAudios.find(
        (a) => String(a.owner_id) === ownerId && String(a.id) === id,
      );
      if (!audio) {
        return null;
      }
      return getAudioItem(audio);
    })
    .filter((audio) => audio !== null);
};
