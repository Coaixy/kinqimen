/**
 * 奇门遁甲工具函数
 */

import { JIAZI, TIAN_GAN, DI_ZHI, JJ } from "../data/tables";

/**
 * 从指定元素起循环排列数组
 * 对应 Python new_list()
 *
 * @example
 * rotateFrom(['a','b','c','d'], 'c') // ['c','d','a','b']
 */
export function rotateFrom<T>(arr: readonly T[], from: T): T[] {
  const index = arr.indexOf(from);
  if (index === -1) {
    throw new Error(`元素 "${from}" 不在数组中`);
  }
  return [...arr.slice(index), ...arr.slice(0, index)];
}

/**
 * 从指定元素起逆序循环排列数组
 * 对应 Python new_list_r()
 *
 * @example
 * rotateFromReverse(['a','b','c','d'], 'c') // ['c','b','a','d']
 */
export function rotateFromReverse<T>(arr: readonly T[], from: T): T[] {
  const index = arr.indexOf(from);
  if (index === -1) {
    throw new Error(`元素 "${from}" 不在数组中`);
  }
  const result: T[] = [];
  let pos = index;
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[pos]);
    pos = (pos - 1 + arr.length) % arr.length;
  }
  return result;
}

/**
 * 多 key 字典查找
 * 对应 Python multi_key_dict_get()
 *
 * @example
 * multiKeyGet([[['a','b'], 1], [['c'], 2]], 'b') // 1
 */
export function multiKeyGet<V>(
  entries: [string | string[], V][],
  key: string
): V | undefined {
  for (const [keys, value] of entries) {
    if (Array.isArray(keys)) {
      if (keys.includes(key)) return value;
    } else {
      if (keys === key) return value;
    }
  }
  return undefined;
}

/**
 * 将数组按指定大小分割
 * 对应 Python split_list()
 */
export function splitList<T>(arr: readonly T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize) as T[]);
  }
  return result;
}

/**
 * 获取六甲旬首字典
 * 将每个干支映射到其所属的旬首
 *
 * @example
 * liujiashunDict().get('甲子') // '甲子'
 * liujiashunDict().get('乙丑') // '甲子'
 * liujiashunDict().get('癸酉') // '甲子'
 */
export function liujiashunDict(): Map<string, string> {
  const result = new Map<string, string>();
  const xunHeads = JIAZI.filter((_, i) => i % 10 === 0); // 甲子, 甲戌, 甲申, 甲午, 甲辰, 甲寅

  for (let i = 0; i < 6; i++) {
    const xunHead = xunHeads[i];
    for (let j = 0; j < 10; j++) {
      result.set(JIAZI[i * 10 + j], xunHead);
    }
  }
  return result;
}

// 缓存旬首字典
let _liujiashunCache: Map<string, string> | null = null;

/**
 * 获取干支的旬首
 * 对应 Python shun()
 *
 * @example
 * shun('甲子') // '甲子'
 * shun('乙丑') // '甲子'
 */
export function shun(ganzhi: string): string {
  if (!_liujiashunCache) {
    _liujiashunCache = liujiashunDict();
  }
  const result = _liujiashunCache.get(ganzhi);
  if (!result) {
    throw new Error(`无效的干支: ${ganzhi}`);
  }
  return result;
}

/**
 * 获取三元字典
 * 将每个干支映射到上/中/下元
 * 每5个干支为一组，循环上中下
 */
export function findYuenDict(): Map<string, "上" | "中" | "下"> {
  const result = new Map<string, "上" | "中" | "下">();
  const yuanList: ("上" | "中" | "下")[] = ["上", "中", "下"];

  for (let i = 0; i < 60; i++) {
    const groupIndex = Math.floor(i / 5) % 3;
    result.set(JIAZI[i], yuanList[groupIndex]);
  }
  return result;
}

// 缓存三元字典
let _yuenCache: Map<string, "上" | "中" | "下"> | null = null;

/**
 * 获取干支所属的元（上/中/下）
 *
 * @example
 * findYuen('甲子') // '上'
 * findYuen('己巳') // '上'
 * findYuen('庚午') // '中'
 */
export function findYuen(ganzhi: string): "上" | "中" | "下" {
  if (!_yuenCache) {
    _yuenCache = findYuenDict();
  }
  const result = _yuenCache.get(ganzhi);
  if (!result) {
    throw new Error(`无效的干支: ${ganzhi}`);
  }
  return result;
}

/**
 * 获取天干索引（0-9）
 */
export function tianGanIndex(gan: string): number {
  const index = TIAN_GAN.indexOf(gan as typeof TIAN_GAN[number]);
  if (index === -1) {
    throw new Error(`无效的天干: ${gan}`);
  }
  return index;
}

/**
 * 获取地支索引（0-11）
 */
export function diZhiIndex(zhi: string): number {
  const index = DI_ZHI.indexOf(zhi as typeof DI_ZHI[number]);
  if (index === -1) {
    throw new Error(`无效的地支: ${zhi}`);
  }
  return index;
}

/**
 * 获取干支在六十甲子中的索引（0-59）
 */
export function jiaziIndex(ganzhi: string): number {
  const index = JIAZI.indexOf(ganzhi);
  if (index === -1) {
    throw new Error(`无效的干支: ${ganzhi}`);
  }
  return index;
}

/**
 * 获取旬首对应的六仪（值符天干）
 *
 * @example
 * getXunYi('甲子') // '戊'
 * getXunYi('甲戌') // '己'
 */
export function getXunYi(xunHead: string): string {
  const yi = JJ[xunHead];
  if (!yi) {
    throw new Error(`无效的旬首: ${xunHead}`);
  }
  return yi;
}

/**
 * 获取干支五行
 */
export function getGanzhiWuxing(gangOrZhi: string): string {
  const wuxingMap: [string[], string][] = [
    [["甲", "寅", "乙", "卯", "震", "巽"], "木"],
    [["丙", "巳", "丁", "午", "离"], "火"],
    [["壬", "亥", "癸", "子", "坎"], "水"],
    [["庚", "申", "辛", "酉", "乾", "兑"], "金"],
    [["未", "丑", "戊", "己", "辰", "戌", "艮", "坤", "中"], "土"],
  ];

  for (const [chars, wuxing] of wuxingMap) {
    if (chars.includes(gangOrZhi)) {
      return wuxing;
    }
  }
  throw new Error(`无法找到 "${gangOrZhi}" 的五行`);
}

/**
 * 五行相生相克关系
 */
export function findWuxingRelation(wx1: string, wx2: string): string {
  // 五行相生：木生火，火生土，土生金，金生水，水生木
  // 五行相克：木克土，土克水，水克火，火克金，金克木
  const sheng = [
    ["木", "火"],
    ["火", "土"],
    ["土", "金"],
    ["金", "水"],
    ["水", "木"],
  ];
  const ke = [
    ["木", "土"],
    ["土", "水"],
    ["水", "火"],
    ["火", "金"],
    ["金", "木"],
  ];

  if (wx1 === wx2) return "比和";

  for (const [a, b] of sheng) {
    if (a === wx1 && b === wx2) return "我生";
    if (a === wx2 && b === wx1) return "生我";
  }

  for (const [a, b] of ke) {
    if (a === wx1 && b === wx2) return "我克";
    if (a === wx2 && b === wx1) return "克我";
  }

  throw new Error(`无法找到 "${wx1}" 和 "${wx2}" 的关系`);
}
