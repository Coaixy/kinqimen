/**
 * 干支计算相关函数
 */

import { TIAN_GAN, DI_ZHI } from "../data/tables";
import type { CalendarAdapter, GanzhiResult } from "./adapter";

/**
 * 五虎遁：根据年干确定正月天干
 * 甲己之年丙作首（正月为丙寅）
 * 乙庚之年戊为头（正月为戊寅）
 * 丙辛岁首寻庚起（正月为庚寅）
 * 丁壬壬位顺行流（正月为壬寅）
 * 戊癸何方发？甲寅最好求（正月为甲寅）
 */
export function getMonthGanStart(yearGan: string): string {
  const mapping: Record<string, string> = {
    "甲": "丙",
    "己": "丙",
    "乙": "戊",
    "庚": "戊",
    "丙": "庚",
    "辛": "庚",
    "丁": "壬",
    "壬": "壬",
    "戊": "甲",
    "癸": "甲",
  };
  const gan = mapping[yearGan];
  if (!gan) {
    throw new Error(`无效的年干: ${yearGan}`);
  }
  return gan;
}

/**
 * 五鼠遁：根据日干确定子时天干
 * 甲己还加甲（子时为甲子）
 * 乙庚丙作初（子时为丙子）
 * 丙辛从戊起（子时为戊子）
 * 丁壬庚子居（子时为庚子）
 * 戊癸何处发？壬子是真途（子时为壬子）
 */
export function getHourGanStart(dayGan: string): string {
  const mapping: Record<string, string> = {
    "甲": "甲",
    "己": "甲",
    "乙": "丙",
    "庚": "丙",
    "丙": "戊",
    "辛": "戊",
    "丁": "庚",
    "壬": "庚",
    "戊": "壬",
    "癸": "壬",
  };
  const gan = mapping[dayGan];
  if (!gan) {
    throw new Error(`无效的日干: ${dayGan}`);
  }
  return gan;
}

/**
 * 根据日干和时支计算时干支
 */
export function getHourGanzhi(dayGan: string, hourZhi: string): string {
  const startGan = getHourGanStart(dayGan);
  const startGanIndex = TIAN_GAN.indexOf(startGan as typeof TIAN_GAN[number]);
  const hourZhiIndex = DI_ZHI.indexOf(hourZhi as typeof DI_ZHI[number]);

  if (startGanIndex === -1) {
    throw new Error(`无效的起始天干: ${startGan}`);
  }
  if (hourZhiIndex === -1) {
    throw new Error(`无效的时支: ${hourZhi}`);
  }

  const hourGanIndex = (startGanIndex + hourZhiIndex) % 10;
  return TIAN_GAN[hourGanIndex] + hourZhi;
}

/**
 * 根据小时数获取时支
 * 子时: 23:00-00:59
 * 丑时: 01:00-02:59
 * ...
 */
export function getHourZhi(hour: number): string {
  // 子时特殊处理：23点和0点都是子时
  if (hour === 23 || hour === 0) {
    return "子";
  }
  // 其他时辰：每两小时一个时辰，从1点开始是丑时
  const index = Math.floor((hour + 1) / 2);
  return DI_ZHI[index];
}

/**
 * 获取完整的四柱干支
 * 如果提供了 adapter，使用 adapter 计算；否则需要自行处理
 */
export function getGanzhiFromDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  adapter: CalendarAdapter
): GanzhiResult {
  return adapter.getGanzhi(year, month, day, hour, minute);
}

/**
 * 将干支数组格式化为字符串
 */
export function formatGanzhi(gz: GanzhiResult): string {
  return `${gz.year}年${gz.month}月${gz.day}日${gz.hour}时`;
}
