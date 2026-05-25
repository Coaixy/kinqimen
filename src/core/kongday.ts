/**
 * 旬空（孤虚）计算
 */

import { GUXU } from "../data/tables";
import { shun } from "./helpers";

/**
 * 计算日空和时空
 *
 * @param dayGanzhi 日干支
 * @param hourGanzhi 时干支
 * @returns 日空和时空
 */
export function calcDayKongShiKong(
  dayGanzhi: string,
  hourGanzhi: string
): { dayKong: string; hourKong: string } {
  const dayXunHead = shun(dayGanzhi);
  const hourXunHead = shun(hourGanzhi);

  const dayGuxu = GUXU[dayXunHead];
  const hourGuxu = GUXU[hourXunHead];

  if (!dayGuxu) {
    throw new Error(`无法获取日空: 旬首 ${dayXunHead}`);
  }
  if (!hourGuxu) {
    throw new Error(`无法获取时空: 旬首 ${hourXunHead}`);
  }

  return {
    dayKong: dayGuxu.gu,
    hourKong: hourGuxu.gu,
  };
}
