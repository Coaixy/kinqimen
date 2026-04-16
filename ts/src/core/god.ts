/**
 * 八神排布
 */

import { GOD_YANG, GOD_YIN, CLOCKWISE_EIGHT } from "../data/tables";
import { rotateFrom, rotateFromReverse } from "./helpers";
import type { ZhifuZhishiResult } from "./zhifu";

/**
 * 构建八神盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns 八神宫位映射，如 { "坎": "符", "坤": "蛇", ... }
 */
export function buildGodPan(
  juString: string,
  zhifuZhishi: ZhifuZhishiResult
): Record<string, string> {
  const yinyang = juString[0];

  // 值符星所在宫是八神起点
  const [_, startGong] = zhifuZhishi.值符星宫;

  // 处理中宫：借坤宫
  let actualStartGong = startGong === "中" ? "坤" : startGong;

  // 确保起始宫在八卦序列中
  if (!CLOCKWISE_EIGHT.includes(actualStartGong as typeof CLOCKWISE_EIGHT[number])) {
    actualStartGong = "坤";
  }

  // 八神序列：阳遁和阴遁使用不同的神
  const godList = yinyang === "阳" ? GOD_YANG : GOD_YIN;

  // 八神固定从"符"开始，不需要旋转神序列
  // 只需要旋转宫序列

  // 获取宫序列：阳遁顺排，阴遁逆排
  const gongOrder = yinyang === "阳"
    ? rotateFrom(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number])
    : rotateFromReverse(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number]);

  // 构建神盘
  const godPan: Record<string, string> = {};
  for (let i = 0; i < 8; i++) {
    godPan[gongOrder[i]] = godList[i];
  }

  return godPan;
}

/**
 * 获取某宫的神
 */
export function getGodAtGong(godPan: Record<string, string>, gong: string): string | undefined {
  return godPan[gong];
}
