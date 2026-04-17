/**
 * 暗干排盘
 *
 * 算法：
 * 1. 找出值使门落宫
 * 2. 将时干写在值使门落宫，作为该宫暗干
 * 3. 从该宫开始，按阳顺飞阴逆飞方向，依次在九宫中飞布后续暗干
 * 4. 按三奇六仪序循环：戊己庚辛壬癸丁丙乙
 * 5. 宫序按九宫飞星（洛书数序）：坎1坤2震3巽4中5乾6兑7艮8离9
 *
 * 特殊情况：
 * - 时干为甲：用旬首六仪代替，从中五宫起飞（若六仪=中宫地盘干则回值使门落宫）
 * - 值符与值使同宫（伏吟局）：从中五宫起飞
 * - 值使门落宫地盘干与时干相同：从中宫起飞
 */

import { EIGHT_GUA, JJ } from "../data/tables";
import { rotateFrom, rotateFromReverse, shun } from "./helpers";
import type { ZhifuZhishi, Gong } from "../types";

/**
 * 三奇六仪循环序（六仪+三奇）
 * 暗干飞布按此序从时干位置开始循环
 */
const STEM_CYCLE = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"] as const;

/**
 * 构建暗干盘
 *
 * @param juString 排局字符串，如 "阳三局上"
 * @param zhifuZhishi 值符值使结果
 * @param earthPan 地盘（宫→天干）
 * @param hourGanzhi 时干支，如 "丙午"
 * @returns 九宫暗干映射（宫名→天干）
 */
export function buildAnganPan(
  juString: string,
  zhifuZhishi: ZhifuZhishi,
  earthPan: Record<string, string>,
  hourGanzhi: string,
): Record<Gong, string> {
  const yinyang = juString[0]; // "阳" or "阴"
  const hourGan = hourGanzhi[0]; // 时干
  const xunHead = shun(hourGanzhi); // 旬首

  const zhishiGong = zhifuZhishi.值使门宫[1]; // 值使门落宫
  const zhifuGong = zhifuZhishi.值符星宫[1]; // 值符星落宫

  let startStem: string;
  let startPalace: string;

  if (hourGan === "甲") {
    // 特殊情况1：时干为甲，用旬首六仪代替
    startStem = JJ[xunHead];
    if (startStem === earthPan["中"]) {
      // 六仪与中宫地盘干相同 → 改从值使门落宫起，避免伏吟
      startPalace = zhishiGong;
    } else {
      // 默认从中五宫开始
      startPalace = "中";
    }
  } else {
    startStem = hourGan;

    if (zhishiGong === zhifuGong) {
      // 特殊情况2：值符与值使同宫（伏吟局）→ 从中五宫起
      startPalace = "中";
    } else if (earthPan[zhishiGong] === hourGan) {
      // 特殊情况3：值使门落宫地盘干与时干相同 → 从中宫起
      startPalace = "中";
    } else {
      // 正常情况：从值使门落宫起
      startPalace = zhishiGong;
    }
  }

  // 构建九宫顺序
  const palaceOrder = buildPalaceOrder(startPalace, yinyang);

  // 构建天干序列：从 startStem 开始，按三奇六仪序循环
  const stemIdx = STEM_CYCLE.indexOf(startStem as typeof STEM_CYCLE[number]);
  if (stemIdx === -1) {
    throw new Error(`无效的暗干起始干: ${startStem}`);
  }

  const result = {} as Record<Gong, string>;
  for (let i = 0; i < 9; i++) {
    result[palaceOrder[i] as Gong] = STEM_CYCLE[(stemIdx + i) % 9];
  }

  return result;
}

/**
 * 根据起始宫和阴阳构建九宫飞星顺序
 * 使用洛书数序（坎1坤2震3巽4中5乾6兑7艮8离9）
 * 阳遁顺飞（1→2→3→...→9），阴遁逆飞（9→8→7→...→1）
 */
function buildPalaceOrder(startPalace: string, yinyang: string): string[] {
  if (yinyang === "阳") {
    return rotateFrom([...EIGHT_GUA], startPalace);
  } else {
    return rotateFromReverse([...EIGHT_GUA], startPalace);
  }
}
