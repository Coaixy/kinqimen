/**
 * 节气相关函数
 */
import type { CalendarAdapter } from "./adapter";
/**
 * 阳遁节气列表（从冬至起 12 个节气）
 * 冬至、小寒、大寒、立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种
 */
export declare const YANG_DUN_JIEQI: string[];
/**
 * 阴遁节气列表（从夏至起 12 个节气）
 * 夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪
 */
export declare const YIN_DUN_JIEQI: string[];
/**
 * 判断节气是否属于阳遁
 */
export declare function isYangDun(jieqiName: string): boolean;
/**
 * 判断节气是否属于阴遁
 */
export declare function isYinDun(jieqiName: string): boolean;
/**
 * 获取阴阳遁
 */
export declare function getYinyangDun(jieqiName: string): "阳" | "阴";
/**
 * 获取当前所属节气名称
 */
export declare function getCurrentJieqiName(year: number, month: number, day: number, hour: number, minute: number, adapter: CalendarAdapter): string;
/**
 * 验证节气名称是否有效
 */
export declare function isValidJieqi(name: string): boolean;
