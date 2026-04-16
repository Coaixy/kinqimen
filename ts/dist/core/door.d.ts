/**
 * 八门排布
 */
import type { ZhifuZhishiResult } from "./zhifu";
/**
 * 构建八门盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns 八门宫位映射，如 { "坎": "休", "坤": "生", ... }
 */
export declare function buildDoorPan(juString: string, zhifuZhishi: ZhifuZhishiResult): Record<string, string>;
/**
 * 获取某宫的门
 */
export declare function getDoorAtGong(doorPan: Record<string, string>, gong: string): string | undefined;
