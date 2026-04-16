/**
 * 历法适配器接口
 * 抽象历法库的调用，便于测试和替换
 */
export interface JieqiInfo {
    name: string;
    datetime: Date;
}
export interface LunarDate {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
}
export interface GanzhiResult {
    year: string;
    month: string;
    day: string;
    hour: string;
}
/**
 * 历法适配器接口
 */
export interface CalendarAdapter {
    /**
     * 获取干支
     * 注意：hour==23 时应按次日 00:00 计算日/时干支
     */
    getGanzhi(year: number, month: number, day: number, hour: number, minute: number): GanzhiResult;
    /**
     * 获取当前所属节气
     * 返回当前时刻所在的节气（已经开始但下一个节气还未到来）
     */
    getCurrentJieqi(year: number, month: number, day: number, hour: number, minute: number): JieqiInfo;
    /**
     * 获取下一个节气
     */
    getNextJieqi(year: number, month: number, day: number): JieqiInfo;
    /**
     * 获取上一个节气
     */
    getPreviousJieqi(year: number, month: number, day: number): JieqiInfo;
    /**
     * 获取农历日期
     */
    getLunarDate(year: number, month: number, day: number): LunarDate;
}
