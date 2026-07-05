export const returnError = (error: unknown) =>
  Error.isError(error) ? error : new Error((error as string).toString());

export const getTimestamp = () => Math.floor(Date.now() / 1000);
