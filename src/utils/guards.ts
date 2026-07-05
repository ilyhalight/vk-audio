import type { VKLang } from "../types/client";
import type { APIErrorResponse } from "../types/api/response";

const VK_LANGS: VKLang[] = ["en", "ru"] as const;

export const isLang = (lang: string): lang is VKLang =>
  VK_LANGS.includes(lang as VKLang);

export const isVKToken = (token: string) => token.startsWith("vk1.");

export const isAPIError = <T>(
  data: T | APIErrorResponse,
): data is APIErrorResponse => {
  if (typeof data !== "object") {
    return false;
  }

  if (Array.isArray(data)) {
    return false;
  }

  return data !== null && Object.hasOwn(data, "error");
};
