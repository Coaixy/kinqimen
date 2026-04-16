/**
 * 繁简转换工具
 * 用于将繁体中文术语转换为简体中文
 */
/**
 * 转换单个字符
 */
export declare function normalizeChar(c: string): string;
/**
 * 转换字符串中的所有繁体字符
 *
 * @example
 * normalizeStr('陽遁') // '阳遁'
 * normalizeStr('兌宮') // '兑宫'
 */
export declare function normalizeStr(s: string): string;
/**
 * 转换对象中所有 key 和 string 类型的 value
 */
export declare function normalizeRecord<T>(record: Record<string, T>): Record<string, T>;
/**
 * 检查字符串是否包含繁体字符
 */
export declare function hasTradChars(s: string): boolean;
