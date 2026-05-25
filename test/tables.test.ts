import { describe, expect, test } from "bun:test";
import {
  TIAN_GAN,
  DI_ZHI,
  JIAZI,
  EIGHT_GUA,
  CLOCKWISE_EIGHT,
  DOOR_R,
  STAR_R,
  CNUMBER,
  JJ,
  JIEQI_NAME,
  JIEQI_CODE,
  GUXU,
  ZHIFU_PAI,
  ZHISHI_PAI,
} from "../src/data/tables";

describe("数据表完整性测试", () => {
  test("天干有 10 个", () => {
    expect(TIAN_GAN.length).toBe(10);
    expect(TIAN_GAN.join("")).toBe("甲乙丙丁戊己庚辛壬癸");
  });

  test("地支有 12 个", () => {
    expect(DI_ZHI.length).toBe(12);
    expect(DI_ZHI.join("")).toBe("子丑寅卯辰巳午未申酉戌亥");
  });

  test("六十甲子有 60 个", () => {
    expect(JIAZI.length).toBe(60);
    expect(JIAZI[0]).toBe("甲子");
    expect(JIAZI[59]).toBe("癸亥");
    // 验证 10, 20, 30, 40, 50 位置
    expect(JIAZI[10]).toBe("甲戌");
    expect(JIAZI[20]).toBe("甲申");
    expect(JIAZI[30]).toBe("甲午");
    expect(JIAZI[40]).toBe("甲辰");
    expect(JIAZI[50]).toBe("甲寅");
  });

  test("九宫有 9 个（含中宫）", () => {
    expect(EIGHT_GUA.length).toBe(9);
    expect(EIGHT_GUA).toContain("中");
  });

  test("顺时针八卦有 8 个（不含中宫）", () => {
    expect(CLOCKWISE_EIGHT.length).toBe(8);
    expect(CLOCKWISE_EIGHT).not.toContain("中");
  });

  test("八门有 8 个", () => {
    expect(DOOR_R.length).toBe(8);
    expect(DOOR_R.join("")).toBe("休生伤杜景死惊开");
  });

  test("九星有 8 个", () => {
    expect(STAR_R.length).toBe(8);
    expect(STAR_R).toContain("禽");
  });

  test("中文数字有 9 个", () => {
    expect(CNUMBER.length).toBe(9);
    expect(CNUMBER.join("")).toBe("一二三四五六七八九");
  });

  test("六甲旬首有 6 个", () => {
    expect(Object.keys(JJ).length).toBe(6);
    expect(JJ["甲子"]).toBe("戊");
    expect(JJ["甲戌"]).toBe("己");
    expect(JJ["甲申"]).toBe("庚");
    expect(JJ["甲午"]).toBe("辛");
    expect(JJ["甲辰"]).toBe("壬");
    expect(JJ["甲寅"]).toBe("癸");
  });

  test("24 节气名", () => {
    expect(JIEQI_NAME.length).toBe(24);
    expect(JIEQI_NAME).toContain("冬至");
    expect(JIEQI_NAME).toContain("夏至");
  });

  test("节气编码覆盖所有 24 节气", () => {
    for (const jq of JIEQI_NAME) {
      expect(JIEQI_CODE[jq]).toBeDefined();
      expect(JIEQI_CODE[jq].length).toBe(3);
    }
  });

  test("旬空表有 6 条", () => {
    expect(Object.keys(GUXU).length).toBe(6);
    expect(GUXU["甲子"].孤).toBe("戌亥");
    expect(GUXU["甲子"].虚).toBe("辰巳");
  });

  test("值符排布表结构正确", () => {
    expect(Object.keys(ZHIFU_PAI["阳"]).length).toBe(9);
    expect(Object.keys(ZHIFU_PAI["阴"]).length).toBe(9);
    // 每个值应该是 9 位数字字符串
    expect(ZHIFU_PAI["阳"]["一"].length).toBe(9);
    expect(ZHIFU_PAI["阴"]["九"].length).toBe(9);
  });

  test("值使排布表结构正确", () => {
    expect(Object.keys(ZHISHI_PAI["阳"]).length).toBe(9);
    expect(Object.keys(ZHISHI_PAI["阴"]).length).toBe(9);
    // 每个值应该是 8 位数字字符串
    expect(ZHISHI_PAI["阳"]["一"].length).toBe(8);
    expect(ZHISHI_PAI["阴"]["九"].length).toBe(8);
  });

  test("所有常量使用简体中文", () => {
    // 检查门名
    expect(DOOR_R).not.toContain("傷");
    expect(DOOR_R).not.toContain("驚");
    expect(DOOR_R).not.toContain("開");

    // 检查卦名
    expect(EIGHT_GUA).not.toContain("兌");
    expect(EIGHT_GUA).not.toContain("離");
    expect(CLOCKWISE_EIGHT).not.toContain("兌");
    expect(CLOCKWISE_EIGHT).not.toContain("離");
  });
});
