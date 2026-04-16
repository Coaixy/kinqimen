/**
 * 基于 tyme4ts 的历法适配器实现
 */

import {
  SolarDay,
  SolarTime,
  SolarTerm,
} from "tyme4ts";
import type {
  CalendarAdapter,
  GanzhiResult,
  JieqiInfo,
  LunarDate,
} from "./adapter";
import { normalizeStr } from "../core/normalize";

/**
 * 将 tyme4ts 的节气名转换为简体
 */
function normalizeJieqiName(name: string): string {
  return normalizeStr(name);
}

/**
 * tyme4ts 历法适配器
 */
export class Tyme4tsCalendarAdapter implements CalendarAdapter {
  getGanzhi(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
  ): GanzhiResult {
    // hour==23 时按次日 00:00 计算
    let adjustedYear = year;
    let adjustedMonth = month;
    let adjustedDay = day;
    let adjustedHour = hour;

    if (hour === 23) {
      const nextDate = new Date(year, month - 1, day + 1);
      adjustedYear = nextDate.getFullYear();
      adjustedMonth = nextDate.getMonth() + 1;
      adjustedDay = nextDate.getDate();
      adjustedHour = 0;
    }

    const solarTime = SolarTime.fromYmdHms(
      adjustedYear,
      adjustedMonth,
      adjustedDay,
      adjustedHour,
      minute,
      0
    );

    const sixtyCycleHour = solarTime.getSixtyCycleHour();

    return {
      year: sixtyCycleHour.getYear().getName(),
      month: sixtyCycleHour.getMonth().getName(),
      day: sixtyCycleHour.getDay().getName(),
      hour: sixtyCycleHour.getSixtyCycle().getName(),
    };
  }

  getCurrentJieqi(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
  ): JieqiInfo {
    const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, 0);
    const term = solarTime.getTerm();

    // 获取节气的精确时刻
    const termDay = term.getSolarDay();
    const termJd = term.getJulianDay();

    return {
      name: normalizeJieqiName(term.getName()),
      datetime: this.julianDayToDate(termJd.getDay()),
    };
  }

  getNextJieqi(year: number, month: number, day: number): JieqiInfo {
    const solarDay = SolarDay.fromYmd(year, month, day);
    const currentTerm = solarDay.getTerm();
    const nextTerm = currentTerm.next(1);

    return {
      name: normalizeJieqiName(nextTerm.getName()),
      datetime: this.julianDayToDate(nextTerm.getJulianDay().getDay()),
    };
  }

  getPreviousJieqi(year: number, month: number, day: number): JieqiInfo {
    const solarDay = SolarDay.fromYmd(year, month, day);
    const currentTerm = solarDay.getTerm();
    const prevTerm = currentTerm.next(-1);

    return {
      name: normalizeJieqiName(prevTerm.getName()),
      datetime: this.julianDayToDate(prevTerm.getJulianDay().getDay()),
    };
  }

  getLunarDate(year: number, month: number, day: number): LunarDate {
    const solarDay = SolarDay.fromYmd(year, month, day);
    const lunarDay = solarDay.getLunarDay();
    const lunarMonth = lunarDay.getLunarMonth();

    return {
      year: lunarMonth.getLunarYear().getYear(),
      month: Math.abs(lunarMonth.getMonth()),
      day: lunarDay.getDay(),
      isLeapMonth: lunarMonth.isLeap(),
    };
  }

  /**
   * 儒略日转换为 Date
   */
  private julianDayToDate(jd: number): Date {
    // 儒略日转公历
    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;

    let a: number;
    if (z < 2299161) {
      a = z;
    } else {
      const alpha = Math.floor((z - 1867216.25) / 36524.25);
      a = z + 1 + alpha - Math.floor(alpha / 4);
    }

    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);

    const dayOfMonth = b - d - Math.floor(30.6001 * e) + f;
    const month = e < 14 ? e - 1 : e - 13;
    const year = month > 2 ? c - 4716 : c - 4715;

    const dayInt = Math.floor(dayOfMonth);
    const fraction = dayOfMonth - dayInt;

    const hours = fraction * 24;
    const hourInt = Math.floor(hours);
    const minuteFraction = (hours - hourInt) * 60;
    const minuteInt = Math.floor(minuteFraction);

    return new Date(year, month - 1, dayInt, hourInt, minuteInt, 0);
  }
}

/**
 * 默认的历法适配器实例
 */
export const defaultCalendarAdapter = new Tyme4tsCalendarAdapter();
