import type { IntBool } from "../utils";
import type { City, Country } from "./shared";

export const FriendStatus = {
  None: 0,
  Outgoing: 1,
  Incoming: 2,
  Friend: 3,
} as const;

export type FriendStatus = (typeof FriendStatus)[keyof typeof FriendStatus];

/**
 * @see https://dev.vk.com/ru/reference/objects/user
 */
export type Profile = {
  id: number;
  city?: City;
  country?: Country;
  activity: string;
  followers_count: number;
  career?: unknown[];
  university?: number;
  university_name?: string;
  faculty?: number;
  faculty_name?: string;
  graduation?: number;
  is_nft: boolean;
  is_esia_verified: boolean;
  is_tinkoff_verified: boolean;
  is_sber_verified: boolean;
  oauth_verification: unknown[];
  /**
   * username
   */
  screen_name: string;
  photo_base: string;
  verified: IntBool;
  /**
   * docs don't know about a possible values, i too...
   */
  trending: number;
  friend_status: FriendStatus;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
};
