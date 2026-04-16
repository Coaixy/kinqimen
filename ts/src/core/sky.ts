/**
 * 天盘排布
 */

import { CLOCKWISE_EIGHT } from "../data/tables";
import { rotateFrom, rotateFromReverse } from "./helpers";
import { invertEarthPan } from "./earth";
import type { ZhifuZhishiResult } from "./zhifu";

/**
 * 构建天盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param earthPan 地盘
 * @param zhifuZhishi 值符值使结果
 * @param fuHead 符头（值符天干/六仪）
 * @returns 天盘宫位映射
 */
export function buildSkyPan(
  juString: string,
  earthPan: Record<string, string>,
  zhifuZhishi: ZhifuZhishiResult,
  fuHead: string
): Record<string, string> {
  const yinyang = juString[0];

  // 值符星所在宫位
  const fuHeadLocation = zhifuZhishi.值符星宫[1];

  // 地盘反查：天干 -> 宫位
  const earthGanToGong = invertEarthPan(earthPan);

  // 符头在地盘的位置
  const fuHeadInEarth = earthGanToGong[fuHead];

  // 顺时针八卦序列（不含中宫）
  const clockwise = [...CLOCKWISE_EIGHT];

  // 获取地盘上八宫的天干（按顺时针顺序）
  const earthGans = clockwise.map(gong => earthPan[gong]);

  // === 处理特殊情况 ===

  // 情况1：值符星宫在中宫
  if (fuHeadLocation === "中") {
    return buildSkyPanFromZhong(yinyang, earthPan, earthGans, clockwise, fuHead);
  }

  // 情况2：普通情况 - 值符不在中宫
  return buildSkyPanNormal(yinyang, earthPan, earthGans, clockwise, fuHead, fuHeadLocation);
}

/**
 * 值符在中宫时的天盘排布
 */
function buildSkyPanFromZhong(
  yinyang: string,
  earthPan: Record<string, string>,
  earthGans: string[],
  clockwise: string[],
  fuHead: string
): Record<string, string> {
  // 从坤宫起排
  const startGong = "坤";

  // 获取坤宫的天干作为起点
  const kunGan = earthPan["坤"];

  // 尝试从符头起排，如果符头不在八宫则从坤宫天干起排
  let startGan = fuHead;
  if (!earthGans.includes(fuHead)) {
    startGan = kunGan;
  }

  // 旋转天干序列
  const ganOrder = yinyang === "阳"
    ? rotateFrom(earthGans, startGan)
    : rotateFromReverse(earthGans, startGan);

  // 旋转宫序列
  const gongOrder = yinyang === "阳"
    ? rotateFrom(clockwise, startGong)
    : rotateFromReverse(clockwise, startGong);

  // 构建天盘
  const skyPan: Record<string, string> = {};
  for (let i = 0; i < 8; i++) {
    skyPan[gongOrder[i]] = ganOrder[i];
  }

  // 中宫天干取地盘中宫天干
  skyPan["中"] = earthPan["中"];

  return skyPan;
}

/**
 * 普通情况的天盘排布
 */
function buildSkyPanNormal(
  yinyang: string,
  earthPan: Record<string, string>,
  earthGans: string[],
  clockwise: string[],
  fuHead: string,
  fuHeadLocation: string
): Record<string, string> {
  // 如果符头不在地盘八宫中，使用值符星宫位置的天干
  let startGan = fuHead;
  if (!earthGans.includes(fuHead)) {
    const earthGanAtLocation = earthPan[fuHeadLocation];
    if (earthGanAtLocation && earthGans.includes(earthGanAtLocation)) {
      startGan = earthGanAtLocation;
    } else {
      // 最后回退：使用地盘第一个天干
      startGan = earthGans[0];
    }
  }

  // 旋转天干序列
  const ganOrder = yinyang === "阳"
    ? rotateFrom(earthGans, startGan)
    : rotateFromReverse(earthGans, startGan);

  // 处理起始宫位：如果值符星宫在中宫，借坤宫
  let actualStartGong = fuHeadLocation === "中" ? "坤" : fuHeadLocation;

  // 确保起始宫在八卦序列中
  if (!clockwise.includes(actualStartGong)) {
    actualStartGong = "坤";
  }

  // 旋转宫序列
  const gongOrder = yinyang === "阳"
    ? rotateFrom(clockwise, actualStartGong)
    : rotateFromReverse(clockwise, actualStartGong);

  // 构建天盘
  const skyPan: Record<string, string> = {};
  for (let i = 0; i < 8; i++) {
    skyPan[gongOrder[i]] = ganOrder[i];
  }

  // 中宫天干取地盘中宫天干
  skyPan["中"] = earthPan["中"];

  return skyPan;
}

/**
 * 获取某宫的天盘天干
 */
export function getSkyGan(skyPan: Record<string, string>, gong: string): string | undefined {
  return skyPan[gong];
}

/**
 * 反转天盘：天干 -> 宫位
 */
export function invertSkyPan(skyPan: Record<string, string>): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const [gong, gan] of Object.entries(skyPan)) {
    inverted[gan] = gong;
  }
  return inverted;
}
