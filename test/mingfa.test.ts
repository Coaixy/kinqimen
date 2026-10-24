import { describe, expect, test } from "bun:test";
import { Qimen } from "../src";
import type { QimenMethod, ZhifuZhishi } from "../src";
import { buildMingfaPan } from "../src/core/mingfa";
import { calcMenpo } from "../src/core/menpo";
import { EIGHT_GUA } from "../src/data/tables";

// Frozen outputs of qimen-go calcGong at 4d3f58fa0f401b5b3a337f119138e99e90685dda.
// Each palace encodes sky stem, earth stem, star, door, god, hidden stem and branch.
function encodePalaces(pan: ReturnType<typeof buildMingfaPan>): string[] {
  return EIGHT_GUA.map(gong => [
    pan.skyPan[gong],
    pan.earthPan[gong],
    pan.starPan[gong],
    pan.doorPan[gong],
    pan.godPan[gong],
    pan.anganPan[gong],
    pan.anzhiPan[gong],
  ].join(""));
}

describe("Mingfa charts", () => {
  test("matches the upstream Yang chart through the public API", () => {
    const pan = new Qimen({
      year: 2024,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30,
    }).pan("鸣法");

    expect(pan.method).toBe("鸣法");
    expect(pan.ju).toBe("阳六局上");
    expect(pan.zhifuZhishi).toEqual({
      zhifuGan: ["甲戌", "己"],
      zhifuStarGong: ["柱", "坤"],
      zhishiDoorGong: ["惊", "兑"],
    });
    expect(encodePalaces(pan)).toEqual([
      "戊壬心休天丁丑", "己癸柱死符戊寅", "庚丁任伤蛇己卯",
      "辛丙英杜阴庚辰", "壬乙蓬中合辛巳", "癸戊芮开勾壬午",
      "丁己冲惊常癸未", "丙庚辅生雀乙亥", "乙辛禽景地丙子",
    ]);
  });

  test("matches the upstream Yin chart through the public API", () => {
    const pan = new Qimen({ year: 2024, month: 12, day: 13, hour: 9, minute: 31 }).pan("鸣法");

    expect(pan.ganzhi).toBe("甲辰年丙子月辛亥日癸巳时");
    expect(pan.jieqi).toBe("大雪");
    expect(pan.ju).toBe("阴四局上");
    expect(pan.zhifuZhishi).toEqual({
      zhifuGan: ["甲申", "庚"],
      zhifuStarGong: ["芮", "艮"],
      zhishiDoorGong: ["死", "坤"],
    });
    expect(encodePalaces(pan)).toEqual([
      "戊辛辅休地乙酉", "乙庚禽死玄癸巳", "丙己心伤常壬辰",
      "丁戊柱杜虎辛卯", "癸乙任中合庚寅", "壬丙英开阴己丑",
      "辛丁蓬惊蛇戊子", "庚癸芮生符丁亥", "己壬冲景天丙戌",
    ]);
  });

  test.each<{
    name: string;
    ju: string;
    hour: string;
    duty: ZhifuZhishi;
    palaces: string[];
  }>([
    {
      name: "Yin stars and doors fly forward while stems and gods fly backward",
      ju: "阴九局上", hour: "丙寅",
      duty: { zhifuGan: ["甲子", "戊"], zhifuStarGong: ["英", "坤"], zhishiDoorGong: ["景", "兑"] },
      palaces: [
        "己乙任伤蛇壬申", "戊丙英杜符辛未", "乙丁蓬中天庚午",
        "丙癸芮开地己巳", "丁壬冲惊玄戊辰", "癸辛辅生常丁卯",
        "壬庚禽景虎丙寅", "辛己心休合乙丑", "庚戊柱死阴癸酉",
      ],
    },
    {
      name: "the duty star can land in the center without hosting",
      ju: "阳一局上", hour: "壬申",
      duty: { zhifuGan: ["甲子", "戊"], zhifuStarGong: ["蓬", "中"], zhishiDoorGong: ["休", "离"] },
      palaces: [
        "癸戊心死常癸酉", "丁己柱伤雀乙丑", "丙庚任杜地丙寅",
        "乙辛英中天丁卯", "戊壬蓬开符戊辰", "己癸芮惊蛇己巳",
        "庚丁冲生阴庚午", "辛丙辅景合辛未", "壬乙禽休勾壬申",
      ],
    },
    {
      name: "Tianqin and the middle door can be the duty star and door",
      ju: "阳五局上", hour: "甲子",
      duty: { zhifuGan: ["甲子", "戊"], zhifuStarGong: ["禽", "中"], zhishiDoorGong: ["中", "中"] },
      palaces: [
        "癸癸蓬休常己巳", "丁丁芮死雀庚午", "丙丙冲伤地辛未",
        "乙乙辅杜天壬申", "戊戊禽中符癸酉", "己己心开蛇乙丑",
        "庚庚柱惊阴丙寅", "辛辛任生合丁卯", "壬壬英景勾戊辰",
      ],
    },
    {
      name: "the duty door can land in the center without hosting",
      ju: "阳一局上", hour: "戊辰",
      duty: { zhifuGan: ["甲子", "戊"], zhifuStarGong: ["蓬", "坎"], zhishiDoorGong: ["休", "中"] },
      palaces: [
        "戊戊蓬开符癸酉", "己己芮惊蛇乙丑", "庚庚冲生阴丙寅",
        "辛辛辅景合丁卯", "壬壬禽休勾戊辰", "癸癸心死常己巳",
        "丁丁柱伤雀庚午", "丙丙任杜地辛未", "乙乙英中天壬申",
      ],
    },
  ])("$name", ({ ju, hour, duty, palaces }) => {
    const pan = buildMingfaPan(ju, hour);
    expect(pan.zhifuZhishi).toEqual(duty);
    expect(encodePalaces(pan)).toEqual(palaces);
  });

  test("the middle door uses Earth for door pressure", () => {
    const pan = buildMingfaPan("阳一局上", "己巳");
    expect(calcMenpo(pan.doorPan)).toContainEqual({
      door: "中", gong: "坎", doorWuxing: "土", gongWuxing: "水",
    });
  });

  test("23:00 advances the day and the Chabu yuan using the existing calendar contract", () => {
    const lateZi = new Qimen({ year: 2024, month: 6, day: 18, hour: 23, minute: 0 }).pan("鸣法");
    const midnight = new Qimen({ year: 2024, month: 6, day: 19, hour: 0, minute: 0 }).pan("鸣法");

    expect(lateZi.ju).toBe("阳三局中");
    expect(lateZi).toEqual(midnight);
  });

  test("rejects unsupported methods instead of returning another chart", () => {
    const qimen = new Qimen({ year: 2024, month: 6, day: 15, hour: 14, minute: 30 });
    expect(() => qimen.pan("unknown" as QimenMethod)).toThrow("不支持的排盘方式");
  });
});
