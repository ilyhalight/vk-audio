export type VKAudioSuccessResult<T> = {
  success: true;
  data: T;
};

export type VKAudioErrorResult = {
  success: false;
  error: Error;
};

export type VKAudioResult<T> = VKAudioSuccessResult<T> | VKAudioErrorResult;
