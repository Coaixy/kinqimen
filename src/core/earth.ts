/**
 * 地盘排布
 */

import {
  CNUMBER,
  EIGHT_GUA,
  YANG_DIPAN_ORDER,
  YIN_DIPAN_ORDER,
  CNUMBER_TO_GUA,
} from "../data/tables";
import { rotateFrom } from "./helpers";

/**
 * 构建地盘
 * 返回九宫天干分布
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @returns 九宫天干映射，如 { "坎": "戊", "坤": "己", ... }
 */
export function buildEarthPan(juString: string): Record<string, string> {
  const yinyang = juString[0];
  const juNumber = juString[1];

  // 确定天干顺序
  const ganOrder = yinyang === "阳" ? YANG_DIPAN_ORDER : YIN_DIPAN_ORDER;

  // 从局数开始旋转宫数
  const gongOrder = rotateFrom(CNUMBER, juNumber as typeof CNUMBER[number]);

  // 构建地盘
  const earthPan: Record<string, string> = {};
  for (let i = 0; i < 9; i++) {
    const gong = CNUMBER_TO_GUA[gongOrder[i]];
    earthPan[gong] = ganOrder[i];
  }

  return earthPan;
}

/**
 * 反转地盘：天干 -> 宫位
 */
export function invertEarthPan(earthPan: Record<string, string>): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const [gong, gan] of Object.entries(earthPan)) {
    inverted[gan] = gong;
  }
  return inverted;
}

/**
 * 获取地盘上某宫的天干
 */
export function getEarthGan(earthPan: Record<string, string>, gong: string): string {
  const gan = earthPan[gong];
  if (!gan) {
    throw new Error(`地盘中没有宫位: ${gong}`);
  }
  return gan;
}

/**
 * 获取地盘上某天干所在的宫
 */
export function getEarthGong(earthPan: Record<string, string>, gan: string): string | undefined {
  const inverted = invertEarthPan(earthPan);
  return inverted[gan];
}
