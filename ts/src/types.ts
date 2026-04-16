/**
 * 奇门遁甲类型定义
 */

// 输入类型
export interface QimenDateInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 基础字面量类型
export type Tiangan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type Dizhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type Gong = "坎" | "坤" | "震" | "巽" | "中" | "乾" | "兑" | "艮" | "离";
export type EightGong = Exclude<Gong, "中">;
export type YinyangDun = "阳遁" | "阴遁";
export type Yuan = "上" | "中" | "下";

// 八门
export type Door = "休" | "生" | "伤" | "杜" | "景" | "死" | "惊" | "开";

// 九星
export type Star = "蓬" | "任" | "冲" | "辅" | "英" | "禽" | "柱" | "心";

// 八神
export type God = "符" | "蛇" | "阴" | "合" | "勾" | "雀" | "地" | "天" | "虎" | "玄";

// 值符值使结果
export interface ZhifuZhishi {
  值符天干: [string, string];  // [旬首, 六仪]
  值符星宫: [string, string];  // [星名, 宫名]
  值使门宫: [string, string];  // [门名, 宫名]
}

// 马星结果
export interface MaXing {
  天马: string;
  丁马: string;
  驿马: string;
}

// 旬空结果
export interface XunKong {
  日空: string;
  时空: string;
}

// 长生运项
export interface ChangshengItem {
  天干: string;
  长生: Record<string, string>;  // 地支 -> 长生状态
}

// 门迫结果
export interface MenpoItem {
  门: string;
  宫: string;
  门五行: string;
  宫五行: string;
}

// 击刑结果
export interface JixingItem {
  宫1: string;
  宫2: string;
  类型: string;
}

// 时家拆补盘返回结构
export interface HourChabuPan {
  排盘方式: "拆补";
  干支: string;
  旬首: string;
  旬空: XunKong;
  局日: string;
  排局: string;
  节气: string;
  值符值使: ZhifuZhishi;
  天乙: string;
  天盘: Partial<Record<Gong, string>>;
  地盘: Record<Gong, string>;
  门: Partial<Record<EightGong, string>>;
  星: Partial<Record<EightGong, string>>;
  神: Partial<Record<EightGong, string>>;
  马星: MaXing;
  长生运: {
    天盘: Record<string, ChangshengItem>;
    地盘: Record<string, ChangshengItem>;
  };
  门迫: MenpoItem[];
  击刑: JixingItem[];
}

// 错误类型
export class QimenInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QimenInputError";
  }
}

export class QimenCalendarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QimenCalendarError";
  }
}

export class QimenRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QimenRuleError";
  }
}
