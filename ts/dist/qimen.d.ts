/**
 * Qimen 主类 - 时家奇门拆补法
 */
import type { QimenDateInput, HourChabuPan } from "./types";
import type { CalendarAdapter } from "./calendar/adapter";
/**
 * 奇门遁甲主类
 *
 * @example
 * ```ts
 * import { Qimen } from "kinqimen";
 *
 * const qimen = new Qimen({
 *   year: 2024,
 *   month: 6,
 *   day: 15,
 *   hour: 14,
 *   minute: 30
 * });
 *
 * const pan = qimen.pan();
 * console.log(pan.排局); // 如 "阳三局上"
 * ```
 */
export declare class Qimen {
    private readonly input;
    private readonly calendar;
    constructor(input: QimenDateInput, calendar?: CalendarAdapter);
    /**
     * 计算时家奇门拆补盘
     * @returns 时家拆补盘结果
     */
    pan(): HourChabuPan;
}
