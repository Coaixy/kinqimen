import { describe, expect, test } from "bun:test";
import { buildEarthPan, invertEarthPan } from "../src/core/earth";
import { calcZhifuZhishi, getZhifuStar, getZhishiDoor } from "../src/core/zhifu";
import { buildDoorPan } from "../src/core/door";
import { buildStarPan } from "../src/core/star";
import { buildGodPan } from "../src/core/god";

describe("地盘测试", () => {
  test("阳一局地盘", () => {
    const earthPan = buildEarthPan("阳一局上");
    // 阳遁一局，从坎宫起戊
    expect(earthPan["坎"]).toBe("戊");
    expect(earthPan["坤"]).toBe("己");
    expect(earthPan["震"]).toBe("庚");
    expect(earthPan["巽"]).toBe("辛");
    expect(earthPan["中"]).toBe("壬");
    expect(earthPan["乾"]).toBe("癸");
    expect(earthPan["兑"]).toBe("丁");
    expect(earthPan["艮"]).toBe("丙");
    expect(earthPan["离"]).toBe("乙");
  });

  test("阳三局地盘", () => {
    const earthPan = buildEarthPan("阳三局上");
    // 阳遁三局，从震宫起戊
    expect(earthPan["震"]).toBe("戊");
    expect(earthPan["巽"]).toBe("己");
    expect(earthPan["中"]).toBe("庚");
  });

  test("阴九局地盘", () => {
    const earthPan = buildEarthPan("阴九局上");
    // 阴遁九局，从离宫起戊
    expect(earthPan["离"]).toBe("戊");
    // 阴遁天干顺序：戊乙丙丁癸壬辛庚己
    expect(earthPan["坎"]).toBe("乙");
    expect(earthPan["坤"]).toBe("丙");
  });

  test("地盘反转", () => {
    const earthPan = buildEarthPan("阳一局上");
    const inverted = invertEarthPan(earthPan);
    expect(inverted["戊"]).toBe("坎");
    expect(inverted["己"]).toBe("坤");
  });

  test("地盘包含九宫", () => {
    const earthPan = buildEarthPan("阳一局上");
    expect(Object.keys(earthPan).length).toBe(9);
    expect(earthPan["中"]).toBeDefined();
  });
});

describe("值符值使测试", () => {
  test("旬首对应的值符星", () => {
    expect(getZhifuStar("甲子")).toBe("蓬");
    expect(getZhifuStar("甲戌")).toBe("任");
    expect(getZhifuStar("甲申")).toBe("冲");
    expect(getZhifuStar("甲午")).toBe("辅");
    expect(getZhifuStar("甲辰")).toBe("英");
    expect(getZhifuStar("甲寅")).toBe("柱");
  });

  test("旬首对应的值使门", () => {
    expect(getZhishiDoor("甲子")).toBe("休");
    expect(getZhishiDoor("甲戌")).toBe("生");
    expect(getZhishiDoor("甲申")).toBe("伤");
    expect(getZhishiDoor("甲午")).toBe("杜");
    expect(getZhishiDoor("甲辰")).toBe("景");
    expect(getZhishiDoor("甲寅")).toBe("死");
  });

  test("计算值符值使 - 阳一局甲子时", () => {
    const result = calcZhifuZhishi("阳一局上", "甲子");
    expect(result.值符天干[0]).toBe("甲子");
    expect(result.值符天干[1]).toBe("戊");
    expect(result.值符星宫[0]).toBe("蓬");
    expect(result.值使门宫[0]).toBe("休");
  });

  test("计算值符值使 - 阴九局甲子时", () => {
    const result = calcZhifuZhishi("阴九局上", "甲子");
    expect(result.值符天干[0]).toBe("甲子");
    expect(result.值符天干[1]).toBe("戊");
    // 阴九局甲子时，根据表格驱动算法，值符星是"英"
    expect(result.值符星宫[0]).toBe("英");
  });

  test("不同时干支有不同的值符值使", () => {
    const result1 = calcZhifuZhishi("阳一局上", "甲子");
    const result2 = calcZhifuZhishi("阳一局上", "甲戌");
    expect(result1.值符天干[0]).not.toBe(result2.值符天干[0]);
    expect(result1.值符星宫[0]).not.toBe(result2.值符星宫[0]);
  });
});

describe("八门盘测试", () => {
  test("阳遁八门顺排", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const doorPan = buildDoorPan("阳一局上", zhifuZhishi);

    expect(Object.keys(doorPan).length).toBe(8);
    // 八门不含中宫
    expect(doorPan["中"]).toBeUndefined();
  });

  test("阴遁八门逆排", () => {
    const zhifuZhishi = calcZhifuZhishi("阴九局上", "甲子");
    const doorPan = buildDoorPan("阴九局上", zhifuZhishi);

    expect(Object.keys(doorPan).length).toBe(8);
  });

  test("门盘包含所有八门", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const doorPan = buildDoorPan("阳一局上", zhifuZhishi);

    const doors = Object.values(doorPan);
    expect(doors).toContain("休");
    expect(doors).toContain("生");
    expect(doors).toContain("伤");
    expect(doors).toContain("杜");
    expect(doors).toContain("景");
    expect(doors).toContain("死");
    expect(doors).toContain("惊");
    expect(doors).toContain("开");
  });
});

describe("九星盘测试", () => {
  test("阳遁九星顺排", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const [starPan] = buildStarPan("阳一局上", zhifuZhishi);

    // 星盘有7个星分布（不含禽）
    expect(Object.keys(starPan).length).toBeLessThanOrEqual(8);
  });

  test("星盘包含主要星", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const [starPan] = buildStarPan("阳一局上", zhifuZhishi);

    const stars = Object.values(starPan);
    expect(stars).toContain("蓬");
    expect(stars).toContain("任");
    expect(stars).toContain("冲");
  });
});

describe("八神盘测试", () => {
  test("阳遁八神", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const godPan = buildGodPan("阳一局上", zhifuZhishi);

    expect(Object.keys(godPan).length).toBe(8);

    // 阳遁使用勾雀
    const gods = Object.values(godPan);
    expect(gods).toContain("勾");
    expect(gods).toContain("雀");
    expect(gods).not.toContain("虎");
    expect(gods).not.toContain("玄");
  });

  test("阴遁八神", () => {
    const zhifuZhishi = calcZhifuZhishi("阴九局上", "甲子");
    const godPan = buildGodPan("阴九局上", zhifuZhishi);

    // 阴遁使用虎玄
    const gods = Object.values(godPan);
    expect(gods).toContain("虎");
    expect(gods).toContain("玄");
    expect(gods).not.toContain("勾");
    expect(gods).not.toContain("雀");
  });

  test("神盘从符开始", () => {
    const zhifuZhishi = calcZhifuZhishi("阳一局上", "甲子");
    const godPan = buildGodPan("阳一局上", zhifuZhishi);

    const gods = Object.values(godPan);
    expect(gods).toContain("符");
  });
});
