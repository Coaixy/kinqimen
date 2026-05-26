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
  zhifuGan: [string, string];
  zhifuStarGong: [string, string];
  zhishiDoorGong: [string, string];
}

// 马星结果
export interface MaXing {
  tianMa: string;
  dingMa: string;
  yiMa: string;
}

// 旬空结果
export interface XunKong {
  dayKong: string;
  hourKong: string;
}

// 长生运项
export interface ChangshengItem {
  gan: string;
  changsheng: Record<string, string>;
}

// 门迫结果
export interface MenpoItem {
  door: string;
  gong: string;
  doorWuxing: string;
  gongWuxing: string;
}

// 击刑结果
export interface JixingItem {
  gong: string;
  gan: string;
}

// 时家拆补盘返回结构
export interface HourChabuPan {
  method: "拆补";
  ganzhi: string;
  xunHead: string;
  xunKong: XunKong;
  juDay: string;
  ju: string;
  jieqi: string;
  zhifuZhishi: ZhifuZhishi;
  tianyi: string;
  skyPan: Partial<Record<Gong, string>>;
  earthPan: Record<Gong, string>;
  doorPan: Partial<Record<EightGong, string>>;
  starPan: Partial<Record<EightGong, string>>;
  godPan: Partial<Record<EightGong, string>>;
  anganPan: Record<Gong, string>;
  maXing: MaXing;
  changshengYun: {
    skyPan: Record<string, ChangshengItem>;
    earthPan: Record<string, ChangshengItem>;
  };
  menpo: MenpoItem[];
  jixing: JixingItem[];
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
