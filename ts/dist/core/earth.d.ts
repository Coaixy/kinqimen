/**
 * 地盘排布
 */
/**
 * 构建地盘
 * 返回九宫天干分布
 *
 * @param juString 排局字符串，如 "阳九局上"
 * @returns 九宫天干映射，如 { "坎": "戊", "坤": "己", ... }
 */
export declare function buildEarthPan(juString: string): Record<string, string>;
/**
 * 反转地盘：天干 -> 宫位
 */
export declare function invertEarthPan(earthPan: Record<string, string>): Record<string, string>;
/**
 * 获取地盘上某宫的天干
 */
export declare function getEarthGan(earthPan: Record<string, string>, gong: string): string;
/**
 * 获取地盘上某天干所在的宫
 */
export declare function getEarthGong(earthPan: Record<string, string>, gan: string): string | undefined;
