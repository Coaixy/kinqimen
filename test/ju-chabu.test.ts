import { describe, expect, test } from "bun:test";
import {
  jieqiCodeLookup,
  getJuNumber,
  qimenJuChaibu,
  qimenJuDay,
  hourGanzhiZhifu,
  parseJuString,
  getFullJuInfo,
} from "../src/core/ju-chabu";
import { JIEQI_NAME } from "../src/data/tables";

describe("节气局数编码测试", () => {
  test("所有节气都有对应的编码", () => {
    for (const jq of JIEQI_NAME) {
      const code = jieqiCodeLookup(jq);
      expect(code).toBeDefined();
      expect(code.length).toBe(3);
    }
  });

  test("冬至编码为 一七四", () => {
    expect(jieqiCodeLookup("冬至")).toBe("一七四");
  });

  test("夏至编码为 九三六", () => {
    expect(jieqiCodeLookup("夏至")).toBe("九三六");
  });

  test("惊蛰编码为 一七四", () => {
    expect(jieqiCodeLookup("惊蛰")).toBe("一七四");
  });

  test("白露编码为 九三六", () => {
    expect(jieqiCodeLookup("白露")).toBe("九三六");
  });
});

describe("局数提取测试", () => {
  test("上元取第一位", () => {
    expect(getJuNumber("上", "一七四")).toBe("一");
    expect(getJuNumber("上", "九三六")).toBe("九");
  });

  test("中元取第二位", () => {
    expect(getJuNumber("中", "一七四")).toBe("七");
    expect(getJuNumber("中", "九三六")).toBe("三");
  });

  test("下元取第三位", () => {
    expect(getJuNumber("下", "一七四")).toBe("四");
    expect(getJuNumber("下", "九三六")).toBe("六");
  });
});

describe("拆补定局测试", () => {
  test("冬至上元一局", () => {
    const gz = { year: "甲辰", month: "丙子", day: "甲子", hour: "甲子" };
    const result = qimenJuChaibu(gz, "冬至");
    expect(result).toBe("阳一局上");
  });

  test("冬至中元七局", () => {
    // 己巳 是第 6 个干支，属于中元
    const gz = { year: "甲辰", month: "丙子", day: "己巳", hour: "甲子" };
    const result = qimenJuChaibu(gz, "冬至");
    expect(result).toBe("阳七局中");
  });

  test("冬至下元四局", () => {
    // 甲戌 是第 11 个干支，属于下元
    const gz = { year: "甲辰", month: "丙子", day: "甲戌", hour: "甲子" };
    const result = qimenJuChaibu(gz, "冬至");
    expect(result).toBe("阳四局下");
  });

  test("夏至上元九局", () => {
    // 己卯 是第 16 个干支，属于上元
    const gz = { year: "甲辰", month: "庚午", day: "己卯", hour: "甲子" };
    const result = qimenJuChaibu(gz, "夏至");
    expect(result).toBe("阴九局上");
  });

  test("夏至中元三局", () => {
    // 甲申 是第 21 个干支，属于中元
    const gz = { year: "甲辰", month: "庚午", day: "甲申", hour: "甲子" };
    const result = qimenJuChaibu(gz, "夏至");
    expect(result).toBe("阴三局中");
  });

  test("夏至下元六局", () => {
    // 己丑 是第 26 个干支，属于下元
    const gz = { year: "甲辰", month: "庚午", day: "己丑", hour: "甲子" };
    const result = qimenJuChaibu(gz, "夏至");
    expect(result).toBe("阴六局下");
  });
});

describe("局日测试", () => {
  test("甲日是甲己日", () => {
    expect(qimenJuDay("甲子")).toBe("甲己日");
  });

  test("己日是甲己日", () => {
    expect(qimenJuDay("己巳")).toBe("甲己日");
  });

  test("乙日是乙庚日", () => {
    expect(qimenJuDay("乙丑")).toBe("乙庚日");
  });

  test("庚日是乙庚日", () => {
    expect(qimenJuDay("庚午")).toBe("乙庚日");
  });

  test("丙日是丙辛日", () => {
    expect(qimenJuDay("丙寅")).toBe("丙辛日");
  });

  test("辛日是丙辛日", () => {
    expect(qimenJuDay("辛未")).toBe("丙辛日");
  });
});

describe("时干支值符测试", () => {
  test("甲子时的旬首和六仪", () => {
    const result = hourGanzhiZhifu("甲子");
    expect(result.xunHead).toBe("甲子");
    expect(result.liuYi).toBe("戊");
  });

  test("乙丑时的旬首和六仪", () => {
    const result = hourGanzhiZhifu("乙丑");
    expect(result.xunHead).toBe("甲子");
    expect(result.liuYi).toBe("戊");
  });

  test("甲戌时的旬首和六仪", () => {
    const result = hourGanzhiZhifu("甲戌");
    expect(result.xunHead).toBe("甲戌");
    expect(result.liuYi).toBe("己");
  });

  test("癸酉时的旬首和六仪", () => {
    const result = hourGanzhiZhifu("癸酉");
    expect(result.xunHead).toBe("甲子");
    expect(result.liuYi).toBe("戊");
  });

  test("癸亥时的旬首和六仪", () => {
    const result = hourGanzhiZhifu("癸亥");
    expect(result.xunHead).toBe("甲寅");
    expect(result.liuYi).toBe("癸");
  });
});

describe("排局字符串解析测试", () => {
  test("解析阳一局上", () => {
    const result = parseJuString("阳一局上");
    expect(result.yinyang).toBe("阳");
    expect(result.juNumber).toBe("一");
    expect(result.yuan).toBe("上");
  });

  test("解析阴九局下", () => {
    const result = parseJuString("阴九局下");
    expect(result.yinyang).toBe("阴");
    expect(result.juNumber).toBe("九");
    expect(result.yuan).toBe("下");
  });

  test("无效字符串抛出错误", () => {
    expect(() => parseJuString("无效")).toThrow();
  });
});

describe("完整排局信息测试", () => {
  test("获取完整的排局信息", () => {
    const gz = { year: "甲辰", month: "丙子", day: "甲子", hour: "甲子" };
    const result = getFullJuInfo(gz, "冬至");

    expect(result.juString).toBe("阳一局上");
    expect(result.yinyang).toBe("阳");
    expect(result.juNumber).toBe("一");
    expect(result.yuan).toBe("上");
    expect(result.juDay).toBe("甲己日");
  });
});
