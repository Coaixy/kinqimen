/**
 * Adapted from deminzhang/qimen-go, commit 4d3f58fa0f401b5b3a337f119138e99e90685dda.
 * Copyright (c) 2024 deminzhang. MIT license; see THIRD_PARTY_NOTICES.md.
 */

import { EIGHT_GUA, JIAZI, YANG_DIPAN_ORDER } from "../data/tables";
import type {
  Dizhi, Gong, HourMingfaPan, MingfaDoor, MingfaGod, MingfaStar, Tiangan,
} from "../types";
import { QimenRuleError } from "../types";
import { buildEarthPan } from "./earth";
import { hourGanzhiZhifu, parseJuString } from "./ju-chabu";

const STARS = ["蓬", "芮", "冲", "辅", "禽", "心", "柱", "任", "英"] as const;
const DOORS = ["休", "死", "伤", "杜", "中", "开", "惊", "生", "景"] as const;
const YANG_GODS = ["符", "蛇", "阴", "合", "勾", "常", "雀", "地", "天"] as const;
const YIN_GODS = ["符", "蛇", "阴", "合", "虎", "常", "玄", "地", "天"] as const;

type MingfaLayers = Pick<HourMingfaPan,
  "zhifuZhishi" | "earthPan" | "skyPan" | "starPan" | "doorPan" |
  "godPan" | "anganPan" | "anzhiPan"
>;

function gongAt(start: number, steps: number, direction: 1 | -1): Gong {
  return EIGHT_GUA[(start + direction * steps + 9) % 9];
}

function findStemPalace(earthPan: Record<Gong, Tiangan>, stem: string): number {
  const index = EIGHT_GUA.findIndex(gong => earthPan[gong] === stem);
  if (index === -1) {
    throw new QimenRuleError(`地盘中找不到天干: ${stem}`);
  }
  return index;
}

export function buildMingfaPan(juString: string, hourGanzhi: string): MingfaLayers {
  const { yinyang } = parseJuString(juString);
  const { xunHead, liuYi } = hourGanzhiZhifu(hourGanzhi);
  const hourIndex = JIAZI.indexOf(hourGanzhi);
  const direction = yinyang === "阳" ? 1 : -1;
  const earthPan = buildEarthPan(juString) as Record<Gong, Tiangan>;
  const duty = findStemPalace(earthPan, liuYi);
  const hourStem = hourGanzhi[0] === "甲" ? liuYi : hourGanzhi[0];
  const starStart = findStemPalace(earthPan, hourStem);
  const doorStartGong = gongAt(duty, hourIndex % 10, direction);
  const doorStart = EIGHT_GUA.indexOf(doorStartGong);
  const stemStart = YANG_DIPAN_ORDER.indexOf(liuYi as typeof YANG_DIPAN_ORDER[number]);

  const skyPan = {} as Record<Gong, Tiangan>;
  const starPan = {} as Record<Gong, MingfaStar>;
  const doorPan = {} as Record<Gong, MingfaDoor>;
  const godPan = {} as Record<Gong, MingfaGod>;
  const anganPan = {} as Record<Gong, Tiangan>;
  const anzhiPan = {} as Record<Gong, Dizhi>;
  const gods = direction === 1 ? YANG_GODS : YIN_GODS;

  for (let step = 0; step < 9; step++) {
    // Mingfa stars and doors always fly forward, including in Yin Dun.
    starPan[gongAt(starStart, step, 1)] = STARS[(duty + step) % 9];
    doorPan[gongAt(doorStart, step, 1)] = DOORS[(duty + step) % 9];
    const gong = gongAt(starStart, step, direction);
    skyPan[gong] = YANG_DIPAN_ORDER[(stemStart + step) % 9];
    godPan[gong] = gods[step];
  }

  const xunIndex = hourIndex - hourIndex % 10;
  // The tenth hour revisits the first palace: 癸 replaces the hidden 甲.
  for (let step = 0; step < 10; step++) {
    const gong = gongAt(duty, step, direction);
    const ganzhi = JIAZI[xunIndex + step];
    anganPan[gong] = ganzhi[0] as Tiangan;
    anzhiPan[gong] = ganzhi[1] as Dizhi;
  }

  return {
    zhifuZhishi: {
      zhifuGan: [xunHead, liuYi],
      zhifuStarGong: [STARS[duty], EIGHT_GUA[starStart]],
      zhishiDoorGong: [DOORS[duty], doorStartGong],
    },
    earthPan,
    skyPan,
    starPan,
    doorPan,
    godPan,
    anganPan,
    anzhiPan,
  };
}
