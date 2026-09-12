import type { Audio } from "../types/api/audio";
import type {
  Playlist,
  PlaylistFollowed,
  PlaylistOriginal,
} from "../types/api/audio/playlist";
import type { AudioStreamMix } from "../types/api/catalog";
import type {
  AudioItem,
  AudioMix,
  PlaylistItem,
  PlaylistItemFollowed,
  PlaylistItemOriginal,
} from "../types/client/section";

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

  const artists = main_artists?.length
    ? main_artists.map((art) => ({
        name: art.name,
        id: art.id,
      }))
    : [
        {
          name: artist,
        },
      ];

  return {
    id,
    ownerId,
    duration,
    artist,
    subtitle,
    artists,
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

export const getAudioMixItem = ({
  id,
  description,
  background_animation_url: lottieBgUrl,
  is_tunable: isTunable,
  titles: { common_state: common, play_state: play },
}: AudioStreamMix): AudioMix => {
  return {
    id,
    description,
    lottieBgUrl,
    isTunable,
    titles: {
      common,
      play,
    },
  };
};

export const getPlaylistItemOriginal = (
  playlistOriginal?: PlaylistOriginal,
): PlaylistItemOriginal | undefined => {
  if (!playlistOriginal) {
    return undefined;
  }

  const {
    playlist_id: playlistId,
    owner_id: ownerId,
    access_key: accessKey,
  } = playlistOriginal;
  return {
    playlistId,
    ownerId,
    accessKey,
  };
};

export const getPlaylistItemFollowed = (
  playlistFollowed?: PlaylistFollowed,
): PlaylistItemFollowed | undefined => {
  if (!playlistFollowed) {
    return undefined;
  }

  const { playlist_id: playlistId, owner_id: ownerId } = playlistFollowed;
  return {
    playlistId,
    ownerId,
  };
};

export const getPlaylistItem = ({
  id,
  owner_id: ownerId,
  type,
  title,
  description,
  count,
  followers,
  plays,
  create_time: createdAt,
  update_time: updatedAt,
  genres,
  is_following: isFollowing,
  photo,
  thumbs,
  access_key: accessKey,
  original,
  followed,
  main_color: mainColor,
  subtitle,
}: Playlist): PlaylistItem => {
  return {
    id,
    ownerId,
    type,
    title,
    description,
    count,
    followers,
    plays,
    createdAt,
    updatedAt,
    genres,
    isFollowing,
    photo,
    thumbs,
    accessKey,
    original: getPlaylistItemOriginal(original),
    followed: getPlaylistItemFollowed(followed),
    mainColor,
    subtitle,
  };
};
