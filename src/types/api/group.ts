import type { IntBool } from "../utils";
import type { City } from "./shared";

export const IsClosed = {
  Opened: 0,
  Closed: 1,
  Private: 2,
} as const;

export type IsClosed = (typeof IsClosed)[keyof typeof IsClosed];

export const MemberStatus = {
  None: 0,
  Member: 1,
  Maybe: 2,
  Declined: 3,
  Pending: 4,
  Invited: 5,
} as const;

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];

export const GroupType = {
  Group: "group",
  Page: "page",
  Event: "event",
} as const;

export type GroupType = (typeof GroupType)[keyof typeof GroupType];

/**
 * @see https://dev.vk.com/ru/reference/objects/group?ref=old_portal
 */
export type Group = {
  id: number;
  member_status: MemberStatus;
  city: City;
  members_count: number;
  activity: string;
  /**
   * docs don't know about a possible values, i too...
   */
  trending: number;
  name: string;
  /**
   * username
   */
  screen_name: string;
  is_closed: IsClosed;
  type: GroupType;
  is_admin: IntBool;
  is_member: IntBool;
  is_advertiser: IntBool;
  verified: IntBool;
  photo_base: string;
};
