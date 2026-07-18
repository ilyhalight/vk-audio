# 0.0.5

- Added `searchAudio` method to search for audio tracks with optional offset
- Added `getSearchSuggestion` method to get search suggestions for audio tracks
- Changed default api domain `vk.com` --> `vk.ru`
- Bump dev depends

# 0.0.4

- Fixed invalid track list in `audios` and `recentAudios` fields in `getSection` method

# 0.0.3

- Fixed merging of `recent` audios in `getSection` method
- Added `subtitle`, `short_videos_allowed`, `stories_allowed` and `stories_cover_allowed` to `Audio` type
- Added `subtitle`, `meta` for `Playlist` type
- Added type `PlaylistType` for field `type` in `Playlist` type
- Added `subtitle` field for `getSection` method
- Added `recent` field for `getSection` method
- Added `blocks` type for `AudioSection` type

# 0.0.2

- fix missed files

# 0.0.1

Initial release
