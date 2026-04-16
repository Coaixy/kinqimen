/**
 * 击刑计算
 *
 * 击刑是指六甲旬首所遁的六仪落入某宫后，
 * 旬首地支与所落宫位地支产生相刑的情况
 *
 * 六甲旬首：
 * - 甲子戊落某宫：子与宫位地支相刑
 * - 甲戌己落某宫：戌与宫位地支相刑
 * - 甲申庚落某宫：申与宫位地支相刑
 * - 甲午辛落某宫：午与宫位地支相刑（午午自刑）
 * - 甲辰壬落某宫：辰与宫位地支相刑（辰辰自刑）
 * - 甲寅癸落某宫：寅与宫位地支相刑
 */

/**
 * 六甲旬首对应的六仪和地支
 */
const LIUJIA: Record<string, { 六仪: string; 地支: string }> = {
  "甲子": { 六仪: "戊", 地支: "子" },
  "甲戌": { 六仪: "己", 地支: "戌" },
  "甲申": { 六仪: "庚", 地支: "申" },
  "甲午": { 六仪: "辛", 地支: "午" },
  "甲辰": { 六仪: "壬", 地支: "辰" },
  "甲寅": { 六仪: "癸", 地支: "寅" },
};

/**
 * 九宫对应的地支
 */
const GONG_ZHI: Record<string, string[]> = {
  "坎": ["子"],
  "坤": ["未", "申"],
  "震": ["卯"],
  "巽": ["辰", "巳"],
  "中": ["辰"],
  "乾": ["戌", "亥"],
  "兑": ["酉"],
  "艮": ["丑", "寅"],
  "离": ["午"],
};

/**
 * 地支相刑表
 * 子卯刑（无礼之刑）
 * 寅巳申刑（无恩之刑/持势之刑）
 * 丑戌未刑（持势之刑）
 * 辰午酉亥自刑
 */
const XING_RELATIONS: Record<string, { 刑: string[]; 类型: string }> = {
  "子": { 刑: ["卯"], 类型: "无礼之刑" },
  "卯": { 刑: ["子"], 类型: "无礼之刑" },
  "寅": { 刑: ["巳", "申"], 类型: "无恩之刑" },
  "巳": { 刑: ["寅", "申"], 类型: "无恩之刑" },
  "申": { 刑: ["寅", "巳"], 类型: "无恩之刑" },
  "丑": { 刑: ["戌", "未"], 类型: "持势之刑" },
  "戌": { 刑: ["丑", "未"], 类型: "持势之刑" },
  "未": { 刑: ["丑", "戌"], 类型: "持势之刑" },
  "辰": { 刑: ["辰"], 类型: "自刑" },
  "午": { 刑: ["午"], 类型: "自刑" },
  "酉": { 刑: ["酉"], 类型: "自刑" },
  "亥": { 刑: ["亥"], 类型: "自刑" },
};

/**
 * 击刑结果
 */
export interface JixingResult {
  旬首: string;      // 如 "甲子"
  六仪: string;      // 如 "戊"
  落宫: string;      // 如 "震"
  旬首地支: string;  // 如 "子"
  宫位地支: string;  // 如 "卯"
  刑类型: string;    // 如 "无礼之刑"
}

/**
 * 计算击刑
 * 根据天盘和地盘找出六甲旬首所遁六仪的落宫，检查是否与宫位地支相刑
 *
 * @param earthPan 地盘 (宫位 -> 天干)
 * @param skyPan 天盘 (宫位 -> 天干)
 * @returns 击刑结果列表
 */
export function calcJixing(
  earthPan: Record<string, string>,
  skyPan?: Record<string, string>
): JixingResult[] {
  const results: JixingResult[] = [];
  const seen = new Set<string>();  // 避免重复

  // 检查某个盘的击刑
  function checkPan(pan: Record<string, string>, panName: string) {
    // 反转盘：天干 -> 宫位
    const ganToGong: Record<string, string> = {};
    for (const [gong, gan] of Object.entries(pan)) {
      ganToGong[gan] = gong;
    }

    // 检查每个六甲旬首
    for (const [xunShou, info] of Object.entries(LIUJIA)) {
      const { 六仪, 地支: xunZhi } = info;
      const gong = ganToGong[六仪];

      if (!gong) continue;

      // 获取该宫的地支
      const gongZhiList = GONG_ZHI[gong] || [];

      // 检查旬首地支与宫位地支是否相刑
      const xingInfo = XING_RELATIONS[xunZhi];
      if (!xingInfo) continue;

      for (const gongZhi of gongZhiList) {
        if (xingInfo.刑.includes(gongZhi)) {
          const key = `${xunShou}-${gong}-${gongZhi}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              旬首: xunShou,
              六仪: 六仪,
              落宫: gong,
              旬首地支: xunZhi,
              宫位地支: gongZhi,
              刑类型: xingInfo.类型,
            });
          }
        }
      }
    }
  }

  // 检查地盘
  checkPan(earthPan, "地盘");

  // 检查天盘
  if (skyPan) {
    checkPan(skyPan, "天盘");
  }

  return results;
}

/**
 * 计算全盘击刑（简化版，用于兼容旧接口）
 */
export function calcAllJixing(
  earthPan: Record<string, string>,
  skyPan?: Record<string, string>
): Array<{
  宫1: string;
  宫2: string;
  类型: string;
}> {
  const jixingResults = calcJixing(earthPan, skyPan);
  return jixingResults.map(r => ({
    宫1: r.旬首 + r.六仪,
    宫2: r.落宫,
    类型: `${r.旬首地支}${r.宫位地支}刑(${r.刑类型})`,
  }));
}
