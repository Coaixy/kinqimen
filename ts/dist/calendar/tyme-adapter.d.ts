/**
 * 基于 tyme4ts 的历法适配器实现
 */
import type { CalendarAdapter, GanzhiResult, JieqiInfo, LunarDate } from "./adapter";
/**
 * tyme4ts 历法适配器
 */
export declare class Tyme4tsCalendarAdapter implements CalendarAdapter {
    getGanzhi(year: number, month: number, day: number, hour: number, minute: number): GanzhiResult;
    getCurrentJieqi(year: number, month: number, day: number, hour: number, minute: number): JieqiInfo;
    getNextJieqi(year: number, month: number, day: number): JieqiInfo;
    getPreviousJieqi(year: number, month: number, day: number): JieqiInfo;
    getLunarDate(year: number, month: number, day: number): LunarDate;
    /**
     * 儒略日转换为 Date
     */
    private julianDayToDate;
}
/**
 * 默认的历法适配器实例
 */
export declare const defaultCalendarAdapter: Tyme4tsCalendarAdapter;
