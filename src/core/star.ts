/**
 * 九星排布
 */

import { STAR_R, CLOCKWISE_EIGHT } from "../data/tables";
import { rotateFrom, rotateFromReverse } from "./helpers";
import type { ZhifuZhishiResult } from "./zhifu";

/**
 * 九星顺序（8星，用于排布）
 * 蓬任冲辅英禽柱心
 */
const STAR_ORDER = ["蓬", "任", "冲", "辅", "英", "禽", "柱", "心"] as const;

/**
 * 构建九星盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns [九星宫位映射, 九星反查映射]
 */
export function buildStarPan(
  juString: string,
  zhifuZhishi: ZhifuZhishiResult
): [Record<string, string>, Record<string, string>] {
  const yinyang = juString[0];

  // 值符星和所在宫
  let [zhifuStar, startGong] = zhifuZhishi.值符星宫;

  // 禽星和芮星是同一星的不同称呼
  if (zhifuStar === "芮") {
    zhifuStar = "禽";
  }

  // 处理中宫：借坤宫
  let actualStartGong = startGong === "中" ? "坤" : startGong;

  // 确保起始宫在八卦序列中
  if (!CLOCKWISE_EIGHT.includes(actualStartGong as typeof CLOCKWISE_EIGHT[number])) {
    actualStartGong = "坤";
  }

  // 找到值符星在排布序列中的位置
  // 芮星替换为禽星
  let startStarForRotation: string = zhifuStar === "芮" ? "禽" : zhifuStar;
  if (!STAR_ORDER.includes(startStarForRotation as typeof STAR_ORDER[number])) {
    startStarForRotation = "蓬";
  }

  // 获取星序列：阳遁顺排，阴遁逆排
  const starOrder = yinyang === "阳"
    ? rotateFrom([...STAR_ORDER], startStarForRotation as typeof STAR_ORDER[number])
    : rotateFromReverse([...STAR_ORDER], startStarForRotation as typeof STAR_ORDER[number]);

  // 获取宫序列：阳遁顺排，阴遁逆排
  const gongOrder = yinyang === "阳"
    ? rotateFrom(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number])
    : rotateFromReverse(CLOCKWISE_EIGHT, actualStartGong as typeof CLOCKWISE_EIGHT[number]);

  // 构建星盘（8星分布在8宫）
  const starPan: Record<string, string> = {};
  const starToGong: Record<string, string> = {};

  // 8星分布到8宫
  for (let i = 0; i < 8; i++) {
    const star: string = starOrder[i];
    starPan[gongOrder[i]] = star;
    starToGong[star] = gongOrder[i];
  }

  // 芮星与禽星同位
  if (starToGong["禽"]) {
    starToGong["芮"] = starToGong["禽"];
  }

  return [starPan, starToGong];
}

/**
 * 获取某宫的星
 */
export function getStarAtGong(starPan: Record<string, string>, gong: string): string | undefined {
  return starPan[gong];
}
