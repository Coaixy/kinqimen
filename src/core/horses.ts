/**
 * 马星计算
 */

import { DING_MA, TIAN_MA, YI_MA } from "../data/tables";
import { shun, multiKeyGet } from "./helpers";

/**
 * 计算丁马
 * 根据日干支的旬首确定丁马位置
 *
 * @param dayGanzhi 日干支
 * @returns 丁马地支
 */
export function calcDingMa(dayGanzhi: string): string {
  const xunHead = shun(dayGanzhi);
  const result = DING_MA[xunHead];
  if (!result) {
    throw new Error(`无法计算丁马: 旬首 ${xunHead}`);
  }
  return result;
}

/**
 * 计算天马
 * 根据日支确定天马位置
 *
 * @param dayGanzhi 日干支
 * @returns 天马地支
 */
export function calcTianMa(dayGanzhi: string): string {
  const dayZhi = dayGanzhi[1];
  const result = multiKeyGet(TIAN_MA, dayZhi);
  if (!result) {
    throw new Error(`无法计算天马: 日支 ${dayZhi}`);
  }
  return result;
}

/**
 * 计算驿马
 * 根据时支确定驿马位置
 *
 * @param hourGanzhi 时干支
 * @returns 驿马地支
 */
export function calcYiMa(hourGanzhi: string): string {
  const hourZhi = hourGanzhi[1];
  const result = multiKeyGet(YI_MA, hourZhi);
  if (!result) {
    throw new Error(`无法计算驿马: 时支 ${hourZhi}`);
  }
  return result;
}

/**
 * 计算所有马星
 */
export function calcAllMa(
  dayGanzhi: string,
  hourGanzhi: string
): { 天马: string; 丁马: string; 驿马: string } {
  return {
    天马: calcTianMa(dayGanzhi),
    丁马: calcDingMa(dayGanzhi),
    驿马: calcYiMa(hourGanzhi),
  };
}
