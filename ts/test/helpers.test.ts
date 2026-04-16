import { describe, expect, test } from "bun:test";
import {
  rotateFrom,
  rotateFromReverse,
  multiKeyGet,
  splitList,
  liujiashunDict,
  shun,
  findYuenDict,
  findYuen,
  tianGanIndex,
  diZhiIndex,
  jiaziIndex,
  getXunYi,
  getGanzhiWuxing,
  findWuxingRelation,
} from "../src/core/helpers";
import { JIAZI } from "../src/data/tables";

describe("rotateFrom 测试", () => {
  test("从指定元素起循环排列", () => {
    const arr = ["a", "b", "c", "d"];
    expect(rotateFrom(arr, "c")).toEqual(["c", "d", "a", "b"]);
    expect(rotateFrom(arr, "a")).toEqual(["a", "b", "c", "d"]);
    expect(rotateFrom(arr, "d")).toEqual(["d", "a", "b", "c"]);
  });

  test("元素不存在时抛出错误", () => {
    expect(() => rotateFrom(["a", "b"], "z")).toThrow();
  });
});

describe("rotateFromReverse 测试", () => {
  test("从指定元素起逆序循环排列", () => {
    const arr = ["a", "b", "c", "d"];
    expect(rotateFromReverse(arr, "c")).toEqual(["c", "b", "a", "d"]);
    expect(rotateFromReverse(arr, "a")).toEqual(["a", "d", "c", "b"]);
  });

  test("元素不存在时抛出错误", () => {
    expect(() => rotateFromReverse(["a", "b"], "z")).toThrow();
  });
});

describe("multiKeyGet 测试", () => {
  test("单个 key 匹配", () => {
    const entries: [string | string[], number][] = [
      ["a", 1],
      ["b", 2],
    ];
    expect(multiKeyGet(entries, "a")).toBe(1);
    expect(multiKeyGet(entries, "b")).toBe(2);
  });

  test("多个 key 匹配", () => {
    const entries: [string | string[], number][] = [
      [["a", "b"], 1],
      [["c"], 2],
    ];
    expect(multiKeyGet(entries, "a")).toBe(1);
    expect(multiKeyGet(entries, "b")).toBe(1);
    expect(multiKeyGet(entries, "c")).toBe(2);
  });

  test("未找到返回 undefined", () => {
    const entries: [string | string[], number][] = [[["a"], 1]];
    expect(multiKeyGet(entries, "z")).toBeUndefined();
  });
});

describe("splitList 测试", () => {
  test("按指定大小分割数组", () => {
    expect(splitList([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    expect(splitList([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe("六甲旬首测试", () => {
  test("liujiashunDict 返回正确映射", () => {
    const dict = liujiashunDict();
    expect(dict.size).toBe(60);
    expect(dict.get("甲子")).toBe("甲子");
    expect(dict.get("乙丑")).toBe("甲子");
    expect(dict.get("癸酉")).toBe("甲子");
    expect(dict.get("甲戌")).toBe("甲戌");
    expect(dict.get("甲寅")).toBe("甲寅");
    expect(dict.get("癸亥")).toBe("甲寅");
  });

  test("shun 返回正确的旬首", () => {
    expect(shun("甲子")).toBe("甲子");
    expect(shun("乙丑")).toBe("甲子");
    expect(shun("癸酉")).toBe("甲子");
    expect(shun("甲戌")).toBe("甲戌");
    expect(shun("己卯")).toBe("甲戌");
  });

  test("shun 对无效干支抛出错误", () => {
    expect(() => shun("无效")).toThrow();
  });
});

describe("三元测试", () => {
  test("findYuenDict 覆盖所有 60 个干支", () => {
    const dict = findYuenDict();
    expect(dict.size).toBe(60);
  });

  test("findYuen 返回正确的元", () => {
    // 六十甲子每5个一组，共12组，循环上中下
    // 组1 (0-4): 甲子,乙丑,丙寅,丁卯,戊辰 → 上
    expect(findYuen("甲子")).toBe("上");
    expect(findYuen("戊辰")).toBe("上");
    // 组2 (5-9): 己巳,庚午,辛未,壬申,癸酉 → 中
    expect(findYuen("己巳")).toBe("中");
    expect(findYuen("庚午")).toBe("中");
    // 组3 (10-14): 甲戌,乙亥,丙子,丁丑,戊寅 → 下
    expect(findYuen("甲戌")).toBe("下");
    expect(findYuen("乙亥")).toBe("下");
    // 组4 (15-19): 己卯,庚辰,辛巳,壬午,癸未 → 上
    expect(findYuen("己卯")).toBe("上");
    expect(findYuen("庚辰")).toBe("上");
    // 组5 (20-24): 甲申,乙酉,丙戌,丁亥,戊子 → 中
    expect(findYuen("甲申")).toBe("中");
    // 组6 (25-29): 己丑,庚寅,辛卯,壬辰,癸巳 → 下
    expect(findYuen("己丑")).toBe("下");
  });

  test("findYuen 对无效干支抛出错误", () => {
    expect(() => findYuen("无效")).toThrow();
  });
});

describe("索引函数测试", () => {
  test("tianGanIndex 返回正确索引", () => {
    expect(tianGanIndex("甲")).toBe(0);
    expect(tianGanIndex("乙")).toBe(1);
    expect(tianGanIndex("癸")).toBe(9);
  });

  test("diZhiIndex 返回正确索引", () => {
    expect(diZhiIndex("子")).toBe(0);
    expect(diZhiIndex("丑")).toBe(1);
    expect(diZhiIndex("亥")).toBe(11);
  });

  test("jiaziIndex 返回正确索引", () => {
    expect(jiaziIndex("甲子")).toBe(0);
    expect(jiaziIndex("乙丑")).toBe(1);
    expect(jiaziIndex("癸亥")).toBe(59);
  });
});

describe("六仪测试", () => {
  test("getXunYi 返回正确的六仪", () => {
    expect(getXunYi("甲子")).toBe("戊");
    expect(getXunYi("甲戌")).toBe("己");
    expect(getXunYi("甲申")).toBe("庚");
    expect(getXunYi("甲午")).toBe("辛");
    expect(getXunYi("甲辰")).toBe("壬");
    expect(getXunYi("甲寅")).toBe("癸");
  });

  test("getXunYi 对无效旬首抛出错误", () => {
    expect(() => getXunYi("甲丑")).toThrow();
  });
});

describe("五行测试", () => {
  test("getGanzhiWuxing 返回正确的五行", () => {
    expect(getGanzhiWuxing("甲")).toBe("木");
    expect(getGanzhiWuxing("丙")).toBe("火");
    expect(getGanzhiWuxing("戊")).toBe("土");
    expect(getGanzhiWuxing("庚")).toBe("金");
    expect(getGanzhiWuxing("壬")).toBe("水");
    expect(getGanzhiWuxing("子")).toBe("水");
    expect(getGanzhiWuxing("午")).toBe("火");
    expect(getGanzhiWuxing("坎")).toBe("水");
    expect(getGanzhiWuxing("离")).toBe("火");
  });

  test("findWuxingRelation 返回正确的关系", () => {
    expect(findWuxingRelation("木", "木")).toBe("比和");
    expect(findWuxingRelation("木", "火")).toBe("我生");
    expect(findWuxingRelation("火", "木")).toBe("生我");
    expect(findWuxingRelation("木", "土")).toBe("我克");
    expect(findWuxingRelation("土", "木")).toBe("克我");
  });
});

describe("六十甲子完整性", () => {
  test("六十甲子每 10 个一旬", () => {
    const xunHeads = JIAZI.filter((_, i) => i % 10 === 0);
    expect(xunHeads).toEqual(["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"]);
  });

  test("六十甲子与 Python 一致", () => {
    // 验证几个关键位置
    expect(JIAZI[0]).toBe("甲子");
    expect(JIAZI[1]).toBe("乙丑");
    expect(JIAZI[2]).toBe("丙寅");
    expect(JIAZI[12]).toBe("丙子");
    expect(JIAZI[24]).toBe("戊子");
    expect(JIAZI[36]).toBe("庚子");
    expect(JIAZI[48]).toBe("壬子");
  });
});
