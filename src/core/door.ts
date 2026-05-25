/**
 * 八门排布
 */

import { DOOR_R, CLOCKWISE_EIGHT } from "../data/tables";
import { rotateFrom, rotateFromReverse } from "./helpers";
import type { ZhifuZhishiResult } from "./zhifu";

/**
 * 构建八门盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns 八门宫位映射，如 { "坎": "休", "坤": "生", ... }
 */
export function buildDoorPan(
  juString: string,
  zhifuZhishi: ZhifuZhishiResult
): Record<string, string> {
  const yinyang = juString[0];

  // 值使门和所在宫
  const [zhishiDoor, startGong] = zhifuZhishi.值使门宫;

  // 处理中宫：借坤宫
  const actualStartGong = startGong === "中" ? "坤" : startGong;

  // 获取门序列：阳遁顺排，阴遁逆排
  const doorOrder = yinyang === "阳"
    ? rotateFrom(DOOR_R, zhishiDoor as typeof DOOR_R[number])
    : rotateFromReverse(DOOR_R, zhishiDoor as typeof DOOR_R[number]);

  // 获取宫序列：阳遁顺排，阴遁逆排
  const gongOrder = yinyang === "阳"
    ? rotateFrom(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number])
    : rotateFromReverse(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number]);

  // 构建门盘
  const doorPan: Record<string, string> = {};
  for (let i = 0; i < 8; i++) {
    doorPan[gongOrder[i]] = doorOrder[i];
  }

  return doorPan;
}

/**
 * 获取某宫的门
 */
export function getDoorAtGong(doorPan: Record<string, string>, gong: string): string | undefined {
  return doorPan[gong];
}
