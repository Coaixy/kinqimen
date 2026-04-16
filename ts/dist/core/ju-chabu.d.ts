/**
 * 拆补法定局
 */
import type { GanzhiResult } from "../calendar/adapter";
/**
 * 根据节气名查找三元局数编码
 * 返回三位字符串，如 "一七四"（上元一局、中元七局、下元四局）
 */
export declare function jieqiCodeLookup(jieqiName: string): string;
/**
 * 根据元（上/中/下）和节气编码获取局数
 */
export declare function getJuNumber(yuan: "上" | "中" | "下", jieqiCode: string): string;
/**
 * 拆补法定局主函数
 *
 * @param gz 四柱干支结果
 * @param jieqiName 当前节气名
 * @returns 排局字符串，如 "阳九局上"
 */
export declare function qimenJuChaibu(gz: GanzhiResult, jieqiName: string): string;
/**
 * 获取局日
 * 根据日干判断局日类型
 */
export declare function qimenJuDay(dayGanzhi: string): string;
/**
 * 获取时干支的值符信息
 * 返回旬首和六仪
 */
export declare function hourGanzhiZhifu(hourGanzhi: string): {
    xunHead: string;
    liuYi: string;
};
/**
 * 解析排局字符串
 * 例如 "阳九局上" -> { yinyang: "阳", juNumber: "九", yuan: "上" }
 */
export declare function parseJuString(juString: string): {
    yinyang: "阳" | "阴";
    juNumber: string;
    yuan: "上" | "中" | "下";
};
/**
 * 获取完整的排局信息
 */
export declare function getFullJuInfo(gz: GanzhiResult, jieqiName: string): {
    juString: string;
    yinyang: "阳" | "阴";
    juNumber: string;
    yuan: "上" | "中" | "下";
    juDay: string;
};
