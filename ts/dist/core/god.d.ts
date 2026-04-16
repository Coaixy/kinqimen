/**
 * 八神排布
 */
import type { ZhifuZhishiResult } from "./zhifu";
/**
 * 构建八神盘
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param zhifuZhishi 值符值使结果
 * @returns 八神宫位映射，如 { "坎": "符", "坤": "蛇", ... }
 */
export declare function buildGodPan(juString: string, zhifuZhishi: ZhifuZhishiResult): Record<string, string>;
/**
 * 获取某宫的神
 */
export declare function getGodAtGong(godPan: Record<string, string>, gong: string): string | undefined;
