/**
 * 奇门遁甲类型定义
 */
export interface QimenDateInput {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}
export type Tiangan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type Dizhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type Gong = "坎" | "坤" | "震" | "巽" | "中" | "乾" | "兑" | "艮" | "离";
export type EightGong = Exclude<Gong, "中">;
export type YinyangDun = "阳遁" | "阴遁";
export type Yuan = "上" | "中" | "下";
export type Door = "休" | "生" | "伤" | "杜" | "景" | "死" | "惊" | "开";
export type Star = "蓬" | "任" | "冲" | "辅" | "英" | "禽" | "柱" | "心";
export type God = "符" | "蛇" | "阴" | "合" | "勾" | "雀" | "地" | "天" | "虎" | "玄";
export interface ZhifuZhishi {
    值符天干: [string, string];
    值符星宫: [string, string];
    值使门宫: [string, string];
}
export interface MaXing {
    天马: string;
    丁马: string;
    驿马: string;
}
export interface XunKong {
    日空: string;
    时空: string;
}
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
    长生运: unknown;
    暗干: Record<EightGong, string>;
    飞干: string;
}
export declare class QimenInputError extends Error {
    constructor(message: string);
}
export declare class QimenCalendarError extends Error {
    constructor(message: string);
}
export declare class QimenRuleError extends Error {
    constructor(message: string);
}
