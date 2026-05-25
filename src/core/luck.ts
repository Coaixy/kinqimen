/**
 * 长生运计算
 */

import {
  DI_ZHI,
  SHIER_CHANG_SHENG,
  YANG_GAN_CHANGSHENG_START,
  YIN_GAN_CHANGSHENG_START,
} from "../data/tables";
import { rotateFrom, rotateFromReverse } from "./helpers";

/**
 * 九宫对应的地支（含双地支宫位）
 */
const GONG_TO_ZHI: Record<string, string[]> = {
  "坎": ["子"],
  "坤": ["未", "申"],
  "震": ["卯"],
  "巽": ["辰", "巳"],
  "中": ["辰"],      // 中宫寄坤，或取辰
  "乾": ["戌", "亥"],
  "兑": ["酉"],
  "艮": ["丑", "寅"],
  "离": ["午"],
};

/**
 * 获取某天干的十二长生表
 * 五阳干（甲丙戊庚壬）顺排，五阴干（乙丁己辛癸）逆排
 *
 * @param gan 天干
 * @returns 地支 -> 长生状态 映射
 */
export function getShierChangsheng(gan: string): Record<string, string> {
  const yangGans = ["甲", "丙", "戊", "庚", "壬"];
  const yinGans = ["乙", "丁", "己", "辛", "癸"];

  let startZhi: string;
  let zhiOrder: string[];

  if (yangGans.includes(gan)) {
    // 阳干顺排
    startZhi = YANG_GAN_CHANGSHENG_START[gan];
    if (!startZhi) {
      throw new Error(`无效的阳干: ${gan}`);
    }
    zhiOrder = rotateFrom(DI_ZHI, startZhi as typeof DI_ZHI[number]);
  } else if (yinGans.includes(gan)) {
    // 阴干逆排
    startZhi = YIN_GAN_CHANGSHENG_START[gan];
    if (!startZhi) {
      throw new Error(`无效的阴干: ${gan}`);
    }
    zhiOrder = rotateFromReverse(DI_ZHI, startZhi as typeof DI_ZHI[number]);
  } else {
    throw new Error(`无效的天干: ${gan}`);
  }

  // 构建映射
  const result: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    result[zhiOrder[i]] = SHIER_CHANG_SHENG[i];
  }

  return result;
}

/**
 * 获取某干支的长生状态
 *
 * @param ganzhi 干支
 * @returns 长生状态
 */
export function getChangshengState(ganzhi: string): string {
  const gan = ganzhi[0];
  const zhi = ganzhi[1];
  const table = getShierChangsheng(gan);
  const state = table[zhi];
  if (!state) {
    throw new Error(`无法获取长生状态: ${ganzhi}`);
  }
  return state;
}

/**
 * 长生运结果项
 */
export interface ChangshengItem {
  天干: string;
  长生: Record<string, string>;  // 地支 -> 长生状态
}

/**
 * 构建长生运
 * 计算天盘和地盘各宫天干的十二长生状态
 * 以各宫天干自身为主，看其在该宫地支的长生状态
 * 双地支宫位（坤未申、巽辰巳、乾戌亥、艮丑寅）分别计算
 *
 * @param skyPan 天盘
 * @param earthPan 地盘
 * @param dayGanzhi 日干支（未使用，保留参数兼容）
 * @returns 长生运结果
 */
export function buildChangshengYun(
  skyPan: Record<string, string>,
  earthPan: Record<string, string>,
  dayGanzhi: string
): {
  天盘: Record<string, ChangshengItem>;
  地盘: Record<string, ChangshengItem>;
} {
  const tianpan: Record<string, ChangshengItem> = {};
  const dipan: Record<string, ChangshengItem> = {};

  // 处理天盘：每宫天干在该宫地支的长生状态
  for (const [gong, gan] of Object.entries(skyPan)) {
    const zhiList = GONG_TO_ZHI[gong];
    if (zhiList) {
      const changshengTable = getShierChangsheng(gan);
      const changsheng: Record<string, string> = {};
      for (const zhi of zhiList) {
        changsheng[zhi] = changshengTable[zhi];
      }
      tianpan[gong] = {
        天干: gan,
        长生: changsheng,
      };
    }
  }

  // 处理地盘：每宫天干在该宫地支的长生状态
  for (const [gong, gan] of Object.entries(earthPan)) {
    const zhiList = GONG_TO_ZHI[gong];
    if (zhiList) {
      const changshengTable = getShierChangsheng(gan);
      const changsheng: Record<string, string> = {};
      for (const zhi of zhiList) {
        changsheng[zhi] = changshengTable[zhi];
      }
      dipan[gong] = {
        天干: gan,
        长生: changsheng,
      };
    }
  }

  return { 天盘: tianpan, 地盘: dipan };
}

/**
 * 获取天乙
 * 从值符值使中提取天乙信息
 */
export function calcTianyi(zhifuZhishi: {
  值符天干: [string, string];
  值符星宫: [string, string];
}): string {
  // 天乙即值符天干
  return zhifuZhishi.值符天干[1];
}
