import { describe, expect, test } from "bun:test";
import { buildSkyPan, invertSkyPan } from "../src/core/sky";
import { buildEarthPan } from "../src/core/earth";
import { calcZhifuZhishi, getZhifuGan } from "../src/core/zhifu";

describe("天盘测试", () => {
  test("阳一局甲子时天盘", () => {
    const juString = "阳一局上";
    const hourGanzhi = "甲子";

    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, hourGanzhi);
    const fuHead = getZhifuGan(hourGanzhi);

    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);

    // 天盘应该包含九宫
    expect(Object.keys(skyPan).length).toBe(9);
    expect(skyPan["中"]).toBeDefined();
  });

  test("阴九局甲子时天盘", () => {
    const juString = "阴九局上";
    const hourGanzhi = "甲子";

    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, hourGanzhi);
    const fuHead = getZhifuGan(hourGanzhi);

    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);

    expect(Object.keys(skyPan).length).toBe(9);
  });

  test("天盘包含所有九个天干", () => {
    const juString = "阳一局上";
    const hourGanzhi = "甲子";

    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, hourGanzhi);
    const fuHead = getZhifuGan(hourGanzhi);

    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);

    const gans = Object.values(skyPan);
    // 应该包含除甲以外的九个天干
    expect(gans).toContain("戊");
    expect(gans).toContain("己");
    expect(gans).toContain("庚");
    expect(gans).toContain("辛");
    expect(gans).toContain("壬");
    expect(gans).toContain("癸");
    expect(gans).toContain("丁");
    expect(gans).toContain("丙");
    expect(gans).toContain("乙");
  });

  test("天盘反转", () => {
    const juString = "阳一局上";
    const hourGanzhi = "甲子";

    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, hourGanzhi);
    const fuHead = getZhifuGan(hourGanzhi);

    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);
    const inverted = invertSkyPan(skyPan);

    // 反转后应该能通过天干找到宫位
    for (const [gong, gan] of Object.entries(skyPan)) {
      expect(inverted[gan]).toBe(gong);
    }
  });

  test("不同时辰天盘不同", () => {
    const juString = "阳一局上";

    const earthPan = buildEarthPan(juString);

    // 使用非甲时，这样值符会移动
    const zhifuZhishi1 = calcZhifuZhishi(juString, "乙丑");
    const fuHead1 = getZhifuGan("乙丑");
    const skyPan1 = buildSkyPan(juString, earthPan, zhifuZhishi1, fuHead1);

    const zhifuZhishi2 = calcZhifuZhishi(juString, "丙寅");
    const fuHead2 = getZhifuGan("丙寅");
    const skyPan2 = buildSkyPan(juString, earthPan, zhifuZhishi2, fuHead2);

    // 不同时辰应该有不同的天盘
    expect(skyPan1).not.toEqual(skyPan2);
  });

  test("阳遁顺排，阴遁逆排", () => {
    const earthPanYang = buildEarthPan("阳一局上");
    const earthPanYin = buildEarthPan("阴九局上");

    const zhifuZhishiYang = calcZhifuZhishi("阳一局上", "甲子");
    const zhifuZhishiYin = calcZhifuZhishi("阴九局上", "甲子");

    const fuHead = getZhifuGan("甲子");

    const skyPanYang = buildSkyPan("阳一局上", earthPanYang, zhifuZhishiYang, fuHead);
    const skyPanYin = buildSkyPan("阴九局上", earthPanYin, zhifuZhishiYin, fuHead);

    // 阳遁和阴遁的天盘应该不同
    expect(skyPanYang).not.toEqual(skyPanYin);
  });

  test("中宫天干与地盘一致", () => {
    const juString = "阳一局上";
    const hourGanzhi = "甲子";

    const earthPan = buildEarthPan(juString);
    const zhifuZhishi = calcZhifuZhishi(juString, hourGanzhi);
    const fuHead = getZhifuGan(hourGanzhi);

    const skyPan = buildSkyPan(juString, earthPan, zhifuZhishi, fuHead);

    // 中宫天干应该与地盘中宫一致
    expect(skyPan["中"]).toBe(earthPan["中"]);
  });
});

describe("各种局数天盘测试", () => {
  const testCases = [
    { ju: "阳一局上", hour: "甲子" },
    { ju: "阳二局中", hour: "乙丑" },
    { ju: "阳三局下", hour: "丙寅" },
    { ju: "阳四局上", hour: "丁卯" },
    { ju: "阳五局中", hour: "戊辰" },
    { ju: "阳六局下", hour: "己巳" },
    { ju: "阳七局上", hour: "庚午" },
    { ju: "阳八局中", hour: "辛未" },
    { ju: "阳九局下", hour: "壬申" },
    { ju: "阴一局上", hour: "癸酉" },
    { ju: "阴三局中", hour: "甲戌" },
    { ju: "阴六局下", hour: "乙亥" },
    { ju: "阴九局上", hour: "甲子" },
  ];

  for (const { ju, hour } of testCases) {
    test(`${ju} ${hour}时天盘`, () => {
      const earthPan = buildEarthPan(ju);
      const zhifuZhishi = calcZhifuZhishi(ju, hour);
      const fuHead = getZhifuGan(hour);

      const skyPan = buildSkyPan(ju, earthPan, zhifuZhishi, fuHead);

      // 基本验证
      expect(Object.keys(skyPan).length).toBe(9);
      expect(skyPan["中"]).toBeDefined();
    });
  }
});
