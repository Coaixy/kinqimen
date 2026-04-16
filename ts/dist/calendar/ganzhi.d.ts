/**
 * 干支计算相关函数
 */
import type { CalendarAdapter, GanzhiResult } from "./adapter";
/**
 * 五虎遁：根据年干确定正月天干
 * 甲己之年丙作首（正月为丙寅）
 * 乙庚之年戊为头（正月为戊寅）
 * 丙辛岁首寻庚起（正月为庚寅）
 * 丁壬壬位顺行流（正月为壬寅）
 * 戊癸何方发？甲寅最好求（正月为甲寅）
 */
export declare function getMonthGanStart(yearGan: string): string;
/**
 * 五鼠遁：根据日干确定子时天干
 * 甲己还加甲（子时为甲子）
 * 乙庚丙作初（子时为丙子）
 * 丙辛从戊起（子时为戊子）
 * 丁壬庚子居（子时为庚子）
 * 戊癸何处发？壬子是真途（子时为壬子）
 */
export declare function getHourGanStart(dayGan: string): string;
/**
 * 根据日干和时支计算时干支
 */
export declare function getHourGanzhi(dayGan: string, hourZhi: string): string;
/**
 * 根据小时数获取时支
 * 子时: 23:00-00:59
 * 丑时: 01:00-02:59
 * ...
 */
export declare function getHourZhi(hour: number): string;
/**
 * 获取完整的四柱干支
 * 如果提供了 adapter，使用 adapter 计算；否则需要自行处理
 */
export declare function getGanzhiFromDate(year: number, month: number, day: number, hour: number, minute: number, adapter: CalendarAdapter): GanzhiResult;
/**
 * 将干支数组格式化为字符串
 */
export declare function formatGanzhi(gz: GanzhiResult): string;
