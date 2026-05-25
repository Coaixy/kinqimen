/**
 * 节气相关函数
 */

import { JIEQI_NAME } from "../data/tables";
import type { CalendarAdapter, JieqiInfo } from "./adapter";

/**
 * 阳遁节气列表（从冬至起 12 个节气）
 * 冬至、小寒、大寒、立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种
 */
export const YANG_DUN_JIEQI = [
  "冬至", "小寒", "大寒", "立春", "雨水", "惊蛰",
  "春分", "清明", "谷雨", "立夏", "小满", "芒种",
];

/**
 * 阴遁节气列表（从夏至起 12 个节气）
 * 夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪
 */
export const YIN_DUN_JIEQI = [
  "夏至", "小暑", "大暑", "立秋", "处暑", "白露",
  "秋分", "寒露", "霜降", "立冬", "小雪", "大雪",
];

/**
 * 判断节气是否属于阳遁
 */
export function isYangDun(jieqiName: string): boolean {
  return YANG_DUN_JIEQI.includes(jieqiName);
}

/**
 * 判断节气是否属于阴遁
 */
export function isYinDun(jieqiName: string): boolean {
  return YIN_DUN_JIEQI.includes(jieqiName);
}

/**
 * 获取阴阳遁
 */
export function getYinyangDun(jieqiName: string): "阳" | "阴" {
  if (isYangDun(jieqiName)) {
    return "阳";
  }
  if (isYinDun(jieqiName)) {
    return "阴";
  }
  throw new Error(`无法判断节气 "${jieqiName}" 的阴阳遁`);
}

/**
 * 获取当前所属节气名称
 */
export function getCurrentJieqiName(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  adapter: CalendarAdapter
): string {
  const jieqi = adapter.getCurrentJieqi(year, month, day, hour, minute);
  return jieqi.name;
}

/**
 * 验证节气名称是否有效
 */
export function isValidJieqi(name: string): boolean {
  return JIEQI_NAME.includes(name as typeof JIEQI_NAME[number]);
}
