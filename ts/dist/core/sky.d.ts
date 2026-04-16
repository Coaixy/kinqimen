/**
 * 天盘排布
 */
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
export declare function buildSkyPan(juString: string, earthPan: Record<string, string>, zhifuZhishi: ZhifuZhishiResult, fuHead: string): Record<string, string>;
/**
 * 获取某宫的天盘天干
 */
export declare function getSkyGan(skyPan: Record<string, string>, gong: string): string | undefined;
/**
 * 反转天盘：天干 -> 宫位
 */
export declare function invertSkyPan(skyPan: Record<string, string>): Record<string, string>;
