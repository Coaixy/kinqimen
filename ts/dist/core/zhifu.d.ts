/**
 * 值符值使计算
 * 使用表格驱动方法，与 Python 原版算法一致
 */
/**
 * 值符值使结果
 */
export interface ZhifuZhishiResult {
    值符天干: [string, string];
    值符星宫: [string, string];
    值使门宫: [string, string];
}
/**
 * 计算值符值使
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @param hourGanzhi 时干支，如 "甲子"
 * @returns 值符值使结果
 */
export declare function calcZhifuZhishi(juString: string, hourGanzhi: string): ZhifuZhishiResult;
/**
 * 获取旬首的值符星（简化方法，用于其他模块）
 */
export declare function getZhifuStar(xunHead: string): string;
/**
 * 获取旬首的值使门（简化方法，用于其他模块）
 */
export declare function getZhishiDoor(xunHead: string): string;
/**
 * 获取值符天干（符头）
 * 即时干支对应的六仪
 */
export declare function getZhifuGan(hourGanzhi: string): string;
