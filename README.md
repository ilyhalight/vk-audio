# @toil/vk-audio

Library for using Modern VK Audio API

Supports:

- `lang` param - `en` (default) | `ru`
- availability to set custom `version` param
- Your own Client implementation with `VKClient` type (default: `VKMobileClient`)
- auto refresh access token for `VKWebClient`

Unsupported:

- Some other endpoints...

## Usage

Install it:

```bash
bun i @toil/vk-audio
```

Simple usage example:

```ts
import { VKAudio } from "@toil/vk-audio";
import { VKMobileClient } from "@toil/vk-audio/client";

const webClient = new VKWebClient({
  cookies: {
    p: COOKIE_P,
    remixsid: COOKIE_REMIX_SID,
  },
});

const client = new VKAudio({
  client: webClient,
  token: {
    value: "",
    expiresIn: -1,
  },
});

const result = await client.getSections();
```

You can see more usage examples in [tests](./tests) folder

## Auth

Lib provides support:

- **VK Web** client with `p` and `remixsid` cookie (just steal it from `Network` tab in browser)
- **VK Mobile** client, but without auto-refresh (token lifetime is `10800`)

## References

Used references:

- [vodka2/vk-audio-token](https://vodka2.github.io/vk-audio-token/)
- [issamansur/vkpymusic](https://github.com/issamansur/vkpymusic)
- my mind...
