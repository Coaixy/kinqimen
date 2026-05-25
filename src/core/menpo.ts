/**
 * 门迫计算
 *
 * 门迫是指八门落入某宫位时，门克宫的情况
 * 即门的五行克所落宫位的五行
 */

/**
 * 八门五行
 */
const DOOR_WUXING: Record<string, string> = {
  "休": "水",
  "生": "土",
  "伤": "木",
  "杜": "木",
  "景": "火",
  "死": "土",
  "惊": "金",
  "开": "金",
};

/**
 * 九宫五行
 */
const GONG_WUXING: Record<string, string> = {
  "坎": "水",
  "坤": "土",
  "震": "木",
  "巽": "木",
  "中": "土",
  "乾": "金",
  "兑": "金",
  "艮": "土",
  "离": "火",
};

/**
 * 五行相克关系（A克B）
 */
const WUXING_KE: Record<string, string> = {
  "金": "木",
  "木": "土",
  "土": "水",
  "水": "火",
  "火": "金",
};

/**
 * 检查是否门迫（门克宫）
 */
function isMenpo(door: string, gong: string): boolean {
  const doorWuxing = DOOR_WUXING[door];
  const gongWuxing = GONG_WUXING[gong];

  if (!doorWuxing || !gongWuxing) return false;

  // 门克宫 = 门的五行克宫的五行
  return WUXING_KE[doorWuxing] === gongWuxing;
}

/**
 * 门迫结果
 */
export interface MenpoResult {
  门: string;
  宫: string;
  门五行: string;
  宫五行: string;
}

/**
 * 计算门迫
 * 检查所有门落宫后是否被宫所克
 *
 * @param doorPan 门盘 (宫位 -> 门名)
 * @returns 门迫结果列表
 */
export function calcMenpo(doorPan: Record<string, string>): MenpoResult[] {
  const results: MenpoResult[] = [];

  for (const [gong, door] of Object.entries(doorPan)) {
    if (isMenpo(door, gong)) {
      results.push({
        门: door,
        宫: gong,
        门五行: DOOR_WUXING[door],
        宫五行: GONG_WUXING[gong],
      });
    }
  }

  return results;
}

/**
 * 获取单个门的门迫状态
 */
export function getDoorMenpoStatus(door: string, gong: string): {
  是否门迫: boolean;
  门五行: string;
  宫五行: string;
} {
  return {
    是否门迫: isMenpo(door, gong),
    门五行: DOOR_WUXING[door] || "",
    宫五行: GONG_WUXING[gong] || "",
  };
}
