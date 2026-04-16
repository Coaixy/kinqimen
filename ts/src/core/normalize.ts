/**
 * 繁简转换工具
 * 用于将繁体中文术语转换为简体中文
 */

// 繁体 -> 简体 映射表
const TRAD_TO_SIMP: Record<string, string> = {
  // 基础术语
  "陽": "阳",
  "陰": "阴",
  "兌": "兑",
  "離": "离",
  "門": "门",
  "盤": "盘",
  "節": "节",
  "馬": "马",
  "長": "长",
  "飛": "飞",
  "補": "补",
  "閏": "闰",
  "驛": "驿",
  "氣": "气",
  // 门名
  "傷": "伤",
  "驚": "惊",
  "開": "开",
  // 星名
  "沖": "冲",
  "輔": "辅",
  // 节气
  "穀": "谷",
  "處": "处",
  // 长生
  "臨": "临",
  "絕": "绝",
  // 其他
  "値": "值",
  "運": "运",
  "宮": "宫",
  "蟄": "蛰",
};

/**
 * 转换单个字符
 */
export function normalizeChar(c: string): string {
  return TRAD_TO_SIMP[c] ?? c;
}

/**
 * 转换字符串中的所有繁体字符
 *
 * @example
 * normalizeStr('陽遁') // '阳遁'
 * normalizeStr('兌宮') // '兑宫'
 */
export function normalizeStr(s: string): string {
  let result = "";
  for (const c of s) {
    result += normalizeChar(c);
  }
  return result;
}

/**
 * 转换对象中所有 key 和 string 类型的 value
 */
export function normalizeRecord<T>(
  record: Record<string, T>
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = normalizeStr(key);
    if (typeof value === "string") {
      result[normalizedKey] = normalizeStr(value) as T;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[normalizedKey] = normalizeRecord(value as Record<string, unknown>) as T;
    } else if (Array.isArray(value)) {
      result[normalizedKey] = value.map((v) =>
        typeof v === "string" ? normalizeStr(v) : v
      ) as T;
    } else {
      result[normalizedKey] = value;
    }
  }
  return result;
}

/**
 * 检查字符串是否包含繁体字符
 */
export function hasTradChars(s: string): boolean {
  for (const c of s) {
    if (c in TRAD_TO_SIMP) {
      return true;
    }
  }
  return false;
}
