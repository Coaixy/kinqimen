/**
 * 值符值使计算
 * 使用表格驱动方法，与 Python 原版算法一致
 */

import {
  CNUMBER,
  CNUMBER_TO_GUA,
  JJ,
  TIAN_GAN,
  JIAZI,
} from "../data/tables";
import { rotateFrom, rotateFromReverse, shun } from "./helpers";

/**
 * 值符值使结果
 */
export interface ZhifuZhishiResult {
  值符天干: [string, string];  // [旬首, 六仪]
  值符星宫: [string, string];  // [星名, 宫名]
  值使门宫: [string, string];  // [门名, 宫名]
}

/**
 * 九星顺序（用于从宫数映射到星名）
 * 蓬芮冲辅禽心柱任英
 */
const STAR_ORDER = ["蓬", "芮", "冲", "辅", "禽", "心", "柱", "任", "英"];

/**
 * 八门顺序（用于从宫数映射到门名）
 * 休死伤杜中开惊生景
 */
const DOOR_ORDER = ["休", "死", "伤", "杜", "中", "开", "惊", "生", "景"];

/**
 * 六甲旬首列表
 */
const JIAZI_XUNHEAD = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];

/**
 * 值符排布基础表
 * 阳遁/阴遁 -> 局数 -> 9位宫序字符串
 */
const ZHIFU_PAI_BASE: Record<string, Record<string, string>> = {
  "阳": {
    "一": "九八七一二三四五六",
    "二": "一九八二三四五六七",
    "三": "二一九三四五六七八",
    "四": "三二一四五六七八九",
    "五": "四三二五六七八九一",
    "六": "五四三六七八九一二",
    "七": "六五四七八九一二三",
    "八": "七六五八九一二三四",
    "九": "八七六九一二三四五",
  },
  "阴": {
    "九": "一二三九八七六五四",
    "八": "九一二八七六五四三",
    "七": "八九一七六五四三二",
    "六": "七八九六五四三二一",
    "五": "六七八五四三二一九",
    "四": "五六七四三二一九八",
    "三": "四五六三二一九八七",
    "二": "三四五二一九八七六",
    "一": "二三四一九八七六五",
  },
};

/**
 * 构建值符排布表
 * 返回 { 旬首 -> 宫数字符串 } 的映射
 */
function buildZhifuPai(yinyang: string, juNumber: string): Record<string, string> {
  const pai = ZHIFU_PAI_BASE[yinyang]?.[juNumber];
  if (!pai) {
    throw new Error(`无效的排局: ${yinyang}${juNumber}局`);
  }

  // 从局数开始旋转宫数序列
  const cnumberArr = [...CNUMBER];
  const rotated = yinyang === "阳"
    ? rotateFrom(cnumberArr, juNumber as typeof CNUMBER[number])
    : rotateFromReverse(cnumberArr, juNumber as typeof CNUMBER[number]);

  // 取前6个作为六甲旬首的前缀
  const prefixes = rotated.slice(0, 6);

  // 构建每个旬首的完整字符串
  const result: Record<string, string> = {};
  for (let i = 0; i < 6; i++) {
    result[JIAZI_XUNHEAD[i]] = prefixes[i] + pai;
  }

  return result;
}

/**
 * 构建值使排布表
 * 返回 { 旬首 -> 宫数字符串 } 的映射
 */
function buildZhishiPai(yinyang: string, juNumber: string): Record<string, string> {
  // 从局数开始旋转宫数序列
  const cnumberArr = [...CNUMBER];
  const rotated = yinyang === "阳"
    ? rotateFrom(cnumberArr, juNumber as typeof CNUMBER[number])
    : rotateFromReverse(cnumberArr, juNumber as typeof CNUMBER[number]);

  // 构建循环字符串（重复3次以便截取）
  const loopStr = rotated.join("") + rotated.join("") + rotated.join("");

  // 构建每个旬首的完整字符串
  const result: Record<string, string> = {};
  const prefixes = rotated.slice(0, 6);

  for (let i = 0; i < 6; i++) {
    const prefix = prefixes[i];
    const startIdx = loopStr.indexOf(prefix) + 1;
    const suffix = loopStr.slice(startIdx, startIdx + 11);
    result[JIAZI_XUNHEAD[i]] = prefix + suffix;
  }

  return result;
}

/**
 * 计算值符值使
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param hourGanzhi 时干支，如 "甲子"
 * @returns 值符值使结果
 */
export function calcZhifuZhishi(
  juString: string,
  hourGanzhi: string
): ZhifuZhishiResult {
  const yinyang = juString[0];
  const juNumber = juString[1];

  // 获取时干索引 (0-9)
  const hourGan = hourGanzhi[0] as typeof TIAN_GAN[number];
  const hgan = TIAN_GAN.indexOf(hourGan);

  // 获取时干支所属旬首
  const xunHead = shun(hourGanzhi);

  // 获取旬首对应的六仪
  const liuYi = JJ[xunHead];

  // 构建值符排布表
  const zhifuPai = buildZhifuPai(yinyang, juNumber);
  const zhifuValue = zhifuPai[xunHead];

  // 构建值使排布表
  const zhishiPai = buildZhishiPai(yinyang, juNumber);
  const zhishiValue = zhishiPai[xunHead];

  // ========== 值符星宫计算 ==========
  // 值符星 = zhifuValue 第一个字符对应的星
  const zhifuFirstChar = zhifuValue[0];
  const zhifuStarIdx = CNUMBER.indexOf(zhifuFirstChar as typeof CNUMBER[number]);
  const zhifuStar = STAR_ORDER[zhifuStarIdx];

  // 值符星宫 = zhifuValue 第 hgan 个字符对应的宫
  const zhifuGongChar = zhifuValue[hgan % zhifuValue.length];
  let zhifuGong = CNUMBER_TO_GUA[zhifuGongChar];

  // ========== 值使门宫计算 ==========
  // 值使门 = zhishiValue 第一个字符对应的门
  const zhishiFirstChar = zhishiValue[0];
  const zhishiDoorIdx = CNUMBER.indexOf(zhishiFirstChar as typeof CNUMBER[number]);
  let zhishiDoor = DOOR_ORDER[zhishiDoorIdx];

  // 如果值使门是"中"，改为"死"门
  if (zhishiDoor === "中") {
    zhishiDoor = "死";
  }

  // 值使门宫 = zhishiValue 第 hgan 个字符对应的宫
  const zhishiGongChar = zhishiValue[hgan % zhishiValue.length];
  let zhishiGong = CNUMBER_TO_GUA[zhishiGongChar];

  return {
    值符天干: [xunHead, liuYi],
    值符星宫: [zhifuStar, zhifuGong],
    值使门宫: [zhishiDoor, zhishiGong],
  };
}

/**
 * 获取旬首的值符星（简化方法，用于其他模块）
 */
export function getZhifuStar(xunHead: string): string {
  // 这个映射是固定的，但实际值符星还需要考虑局数
  // 此函数仅用于向后兼容
  const XUN_HEAD_TO_STAR: Record<string, string> = {
    "甲子": "蓬",
    "甲戌": "任",
    "甲申": "冲",
    "甲午": "辅",
    "甲辰": "英",
    "甲寅": "柱",
  };
  return XUN_HEAD_TO_STAR[xunHead] || "蓬";
}

/**
 * 获取旬首的值使门（简化方法，用于其他模块）
 */
export function getZhishiDoor(xunHead: string): string {
  const XUN_HEAD_TO_DOOR: Record<string, string> = {
    "甲子": "休",
    "甲戌": "生",
    "甲申": "伤",
    "甲午": "杜",
    "甲辰": "景",
    "甲寅": "死",
  };
  return XUN_HEAD_TO_DOOR[xunHead] || "休";
}

/**
 * 获取值符天干（符头）
 * 即时干支对应的六仪
 */
export function getZhifuGan(hourGanzhi: string): string {
  const xunHead = shun(hourGanzhi);
  return JJ[xunHead];
}
