/**
 * 九星排布
 */
import type { ZhifuZhishiResult } from "./zhifu";
/**
 * 构建九星盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns [九星宫位映射, 九星反查映射]
 */
export declare function buildStarPan(juString: string, zhifuZhishi: ZhifuZhishiResult): [Record<string, string>, Record<string, string>];
/**
 * 获取某宫的星
 */
export declare function getStarAtGong(starPan: Record<string, string>, gong: string): string | undefined;
