export type APIErrorRequestParam = {
  key: string;
  value: string;
};

export type APIErrorDetails = {
  error_code: number;
  error_msg: string;
  request_params: APIErrorRequestParam;
};

export type APIErrorResponse = Record<"error", APIErrorDetails>;

export type APISuccessResponse<T> = Record<"response", T>;
