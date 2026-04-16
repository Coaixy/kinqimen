/**
 * Qimen 主类 - 时家奇门拆补法
 */

import type { QimenDateInput, HourChabuPan } from "./types";
import { QimenInputError } from "./types";
import type { CalendarAdapter, GanzhiResult } from "./calendar/adapter";
import { Tyme4tsCalendarAdapter } from "./calendar/tyme-adapter";
import { formatGanzhi } from "./calendar/ganzhi";
import { getCurrentJieqiName } from "./calendar/jieqi";
import { qimenJuChaibu, qimenJuDay, hourGanzhiZhifu } from "./core/ju-chabu";
import { buildEarthPan, invertEarthPan } from "./core/earth";
import { calcZhifuZhishi, getZhifuGan } from "./core/zhifu";
import { buildDoorPan } from "./core/door";
import { buildStarPan } from "./core/star";
import { buildGodPan } from "./core/god";
import { buildSkyPan } from "./core/sky";
import { calcAllMa } from "./core/horses";
import { buildChangshengYun, calcTianyi } from "./core/luck";
import { calcDayKongShiKong } from "./core/kongday";
import { shun } from "./core/helpers";
import { calcMenpo } from "./core/menpo";
import { calcAllJixing } from "./core/jixing";

/**
 * 验证输入参数
 */
function validateInput(input: QimenDateInput): void {
  const { year, month, day, hour, minute } = input;

  if (!Number.isInteger(year)) {
    throw new QimenInputError(`year 必须是整数，收到: ${year}`);
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new QimenInputError(`month 必须是 1-12 的整数，收到: ${month}`);
  }

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new QimenInputError(`day 必须是 1-31 的整数，收到: ${day}`);
  }

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new QimenInputError(`hour 必须是 0-23 的整数，收到: ${hour}`);
  }

  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new QimenInputError(`minute 必须是 0-59 的整数，收到: ${minute}`);
  }

  // 验证日期合法性
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new QimenInputError(
      `无效的日期: ${year}年${month}月${day}日`
    );
  }
}

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
export class Qimen {
  private readonly input: QimenDateInput;
  private readonly calendar: CalendarAdapter;

  constructor(input: QimenDateInput, calendar?: CalendarAdapter) {
    validateInput(input);
    this.input = input;
    this.calendar = calendar ?? new Tyme4tsCalendarAdapter();
  }

  /**
   * 计算时家奇门拆补盘
   * @returns 时家拆补盘结果
   */
  pan(): HourChabuPan {
    const { year, month, day, hour, minute } = this.input;

    // Phase 3: 获取干支和节气
    const gz = this.calendar.getGanzhi(year, month, day, hour, minute);
    const jieqiName = getCurrentJieqiName(year, month, day, hour, minute, this.calendar);

    // Phase 4: 拆补定局
    const juString = qimenJuChaibu(gz, jieqiName);
    const juDay = qimenJuDay(gz.day);
    const xunHead = shun(gz.hour);
    const { 日空: daykong, 时空: shikong } = calcDayKongShiKong(gz.day, gz.hour);

    // Phase 5: 地盘、值符值使、门星神
    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, gz.hour);
    const doorPan = buildDoorPan(juString, zhifuZhishi);
    const [starPan] = buildStarPan(juString, zhifuZhishi);
    const godPan = buildGodPan(juString, zhifuZhishi);

    // Phase 6: 天盘
    const fuHead = getZhifuGan(gz.hour);
    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);

    // Phase 7: 辅助字段
    const tianyi = calcTianyi(zhifuZhishi);
    const maStar = calcAllMa(gz.day, gz.hour);
    const changShengYun = buildChangshengYun(skyPan, earthPan, gz.day);

    // Phase 8: 门迫和击刑
    const menpo = calcMenpo(doorPan);
    const jixing = calcAllJixing(earthPan, skyPan);

    return {
      排盘方式: "拆补",
      干支: formatGanzhi(gz),
      旬首: xunHead,
      旬空: { 日空: daykong, 时空: shikong },
      局日: juDay,
      排局: juString,
      节气: jieqiName,
      值符值使: zhifuZhishi,
      天乙: tianyi,
      天盘: skyPan,
      地盘: earthPan,
      门: doorPan,
      星: starPan,
      神: godPan,
      马星: maStar,
      长生运: changShengYun,
      门迫: menpo,
      击刑: jixing,
    };
  }
}
