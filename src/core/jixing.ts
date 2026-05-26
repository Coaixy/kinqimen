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
const LIUJIA: Record<string, { liuyi: string; zhi: string }> = {
  "甲子": { liuyi: "戊", zhi: "子" },
  "甲戌": { liuyi: "己", zhi: "戌" },
  "甲申": { liuyi: "庚", zhi: "申" },
  "甲午": { liuyi: "辛", zhi: "午" },
  "甲辰": { liuyi: "壬", zhi: "辰" },
  "甲寅": { liuyi: "癸", zhi: "寅" },
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
const XING_RELATIONS: Record<string, { xing: string[]; type: string }> = {
  "子": { xing: ["卯"], type: "无礼之刑" },
  "卯": { xing: ["子"], type: "无礼之刑" },
  "寅": { xing: ["巳", "申"], type: "无恩之刑" },
  "巳": { xing: ["寅", "申"], type: "无恩之刑" },
  "申": { xing: ["寅", "巳"], type: "无恩之刑" },
  "丑": { xing: ["戌", "未"], type: "持势之刑" },
  "戌": { xing: ["丑", "未"], type: "持势之刑" },
  "未": { xing: ["丑", "戌"], type: "持势之刑" },
  "辰": { xing: ["辰"], type: "自刑" },
  "午": { xing: ["午"], type: "自刑" },
  "酉": { xing: ["酉"], type: "自刑" },
  "亥": { xing: ["亥"], type: "自刑" },
};

/**
 * 击刑结果
 */
export interface JixingResult {
  xunHead: string;
  liuyi: string;
  gong: string;
  xunHeadZhi: string;
  gongZhi: string;
  xingType: string;
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
      const { liuyi, zhi: xunZhi } = info;
      const gong = ganToGong[liuyi];

      if (!gong) continue;

      // 获取该宫的地支
      const gongZhiList = GONG_ZHI[gong] || [];

      // 检查旬首地支与宫位地支是否相刑
      const xingInfo = XING_RELATIONS[xunZhi];
      if (!xingInfo) continue;

      for (const gongZhi of gongZhiList) {
        if (xingInfo.xing.includes(gongZhi)) {
          const key = `${xunShou}-${gong}-${gongZhi}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              xunHead: xunShou,
              liuyi,
              gong,
              xunHeadZhi: xunZhi,
              gongZhi,
              xingType: xingInfo.type,
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
 * 计算全盘击刑输出
 */
export function calcAllJixing(
  earthPan: Record<string, string>,
  skyPan?: Record<string, string>
): Array<{
  gong: string;
  gan: string;
}> {
  const jixingResults = calcJixing(earthPan, skyPan);
  return jixingResults.map(r => ({
    gong: r.gong,
    gan: r.xunHead + r.liuyi,
  }));
}
