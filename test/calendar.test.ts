import { describe, expect, test } from "bun:test";
import { Tyme4tsCalendarAdapter } from "../src/calendar/tyme-adapter";
import {
  getHourGanStart,
  getMonthGanStart,
  getHourGanzhi,
  getHourZhi,
} from "../src/calendar/ganzhi";
import {
  isYangDun,
  isYinDun,
  getYinyangDun,
  YANG_DUN_JIEQI,
  YIN_DUN_JIEQI,
} from "../src/calendar/jieqi";

describe("五鼠遁测试", () => {
  test("甲己日起甲子", () => {
    expect(getHourGanStart("甲")).toBe("甲");
    expect(getHourGanStart("己")).toBe("甲");
  });

  test("乙庚日起丙子", () => {
    expect(getHourGanStart("乙")).toBe("丙");
    expect(getHourGanStart("庚")).toBe("丙");
  });

  test("丙辛日起戊子", () => {
    expect(getHourGanStart("丙")).toBe("戊");
    expect(getHourGanStart("辛")).toBe("戊");
  });

  test("丁壬日起庚子", () => {
    expect(getHourGanStart("丁")).toBe("庚");
    expect(getHourGanStart("壬")).toBe("庚");
  });

  test("戊癸日起壬子", () => {
    expect(getHourGanStart("戊")).toBe("壬");
    expect(getHourGanStart("癸")).toBe("壬");
  });
});

describe("五虎遁测试", () => {
  test("甲己年起丙寅", () => {
    expect(getMonthGanStart("甲")).toBe("丙");
    expect(getMonthGanStart("己")).toBe("丙");
  });

  test("乙庚年起戊寅", () => {
    expect(getMonthGanStart("乙")).toBe("戊");
    expect(getMonthGanStart("庚")).toBe("戊");
  });
});

describe("时支计算测试", () => {
  test("子时 (23:00-00:59)", () => {
    expect(getHourZhi(23)).toBe("子");
    expect(getHourZhi(0)).toBe("子");
  });

  test("丑时 (01:00-02:59)", () => {
    expect(getHourZhi(1)).toBe("丑");
    expect(getHourZhi(2)).toBe("丑");
  });

  test("寅时 (03:00-04:59)", () => {
    expect(getHourZhi(3)).toBe("寅");
    expect(getHourZhi(4)).toBe("寅");
  });

  test("午时 (11:00-12:59)", () => {
    expect(getHourZhi(11)).toBe("午");
    expect(getHourZhi(12)).toBe("午");
  });

  test("亥时 (21:00-22:59)", () => {
    expect(getHourZhi(21)).toBe("亥");
    expect(getHourZhi(22)).toBe("亥");
  });
});

describe("时干支计算测试", () => {
  test("甲日子时为甲子", () => {
    expect(getHourGanzhi("甲", "子")).toBe("甲子");
  });

  test("甲日丑时为乙丑", () => {
    expect(getHourGanzhi("甲", "丑")).toBe("乙丑");
  });

  test("乙日子时为丙子", () => {
    expect(getHourGanzhi("乙", "子")).toBe("丙子");
  });

  test("丙日子时为戊子", () => {
    expect(getHourGanzhi("丙", "子")).toBe("戊子");
  });
});

describe("阴阳遁判断测试", () => {
  test("阳遁节气有 12 个", () => {
    expect(YANG_DUN_JIEQI.length).toBe(12);
  });

  test("阴遁节气有 12 个", () => {
    expect(YIN_DUN_JIEQI.length).toBe(12);
  });

  test("冬至是阳遁", () => {
    expect(isYangDun("冬至")).toBe(true);
    expect(isYinDun("冬至")).toBe(false);
    expect(getYinyangDun("冬至")).toBe("阳");
  });

  test("夏至是阴遁", () => {
    expect(isYangDun("夏至")).toBe(false);
    expect(isYinDun("夏至")).toBe(true);
    expect(getYinyangDun("夏至")).toBe("阴");
  });

  test("惊蛰是阳遁", () => {
    expect(getYinyangDun("惊蛰")).toBe("阳");
  });

  test("白露是阴遁", () => {
    expect(getYinyangDun("白露")).toBe("阴");
  });
});

describe("Tyme4ts 历法适配器测试", () => {
  const adapter = new Tyme4tsCalendarAdapter();

  test("获取干支 - 普通日期", () => {
    // 2024年6月15日14时30分
    const gz = adapter.getGanzhi(2024, 6, 15, 14, 30);
    expect(gz.year).toBeDefined();
    expect(gz.month).toBeDefined();
    expect(gz.day).toBeDefined();
    expect(gz.hour).toBeDefined();
    // 每个干支应该是2个字符
    expect(gz.year.length).toBe(2);
    expect(gz.month.length).toBe(2);
    expect(gz.day.length).toBe(2);
    expect(gz.hour.length).toBe(2);
  });

  test("hour==23 按次日计算", () => {
    // 2024年6月15日23时 应该按 2024年6月16日0时计算
    const gz23 = adapter.getGanzhi(2024, 6, 15, 23, 0);
    const gz00 = adapter.getGanzhi(2024, 6, 16, 0, 0);
    // 日干支应该相同
    expect(gz23.day).toBe(gz00.day);
    // 时干支应该相同（都是子时）
    expect(gz23.hour).toBe(gz00.hour);
  });

  test("获取当前节气", () => {
    // 冬至附近的日期
    const jieqi = adapter.getCurrentJieqi(2024, 12, 22, 12, 0);
    expect(jieqi.name).toBeDefined();
    expect(jieqi.datetime).toBeInstanceOf(Date);
  });

  test("获取农历日期", () => {
    const lunar = adapter.getLunarDate(2024, 6, 15);
    expect(lunar.year).toBeDefined();
    expect(lunar.month).toBeGreaterThanOrEqual(1);
    expect(lunar.month).toBeLessThanOrEqual(12);
    expect(lunar.day).toBeGreaterThanOrEqual(1);
    expect(lunar.day).toBeLessThanOrEqual(30);
  });

  test("跨月边界 hour==23", () => {
    // 2024年6月30日23时 应该按 2024年7月1日0时计算
    const gz = adapter.getGanzhi(2024, 6, 30, 23, 0);
    const gzNext = adapter.getGanzhi(2024, 7, 1, 0, 0);
    expect(gz.day).toBe(gzNext.day);
  });

  test("跨年边界 hour==23", () => {
    // 2024年12月31日23时 应该按 2025年1月1日0时计算
    const gz = adapter.getGanzhi(2024, 12, 31, 23, 0);
    const gzNext = adapter.getGanzhi(2025, 1, 1, 0, 0);
    expect(gz.day).toBe(gzNext.day);
  });
});
