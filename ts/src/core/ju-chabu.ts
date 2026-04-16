/**
 * 拆补法定局
 */

import { JIEQI_CODE, CNUMBER, JJ } from "../data/tables";
import { findYuen, shun, getXunYi } from "./helpers";
import { getYinyangDun } from "../calendar/jieqi";
import type { CalendarAdapter, GanzhiResult } from "../calendar/adapter";

/**
 * 根据节气名查找三元局数编码
 * 返回三位字符串，如 "一七四"（上元一局、中元七局、下元四局）
 */
export function jieqiCodeLookup(jieqiName: string): string {
  const code = JIEQI_CODE[jieqiName];
  if (!code) {
    throw new Error(`未找到节气 "${jieqiName}" 的局数编码`);
  }
  return code;
}

/**
 * 根据元（上/中/下）和节气编码获取局数
 */
export function getJuNumber(yuan: "上" | "中" | "下", jieqiCode: string): string {
  const index = { "上": 0, "中": 1, "下": 2 }[yuan];
  return jieqiCode[index];
}

/**
 * 拆补法定局主函数
 *
 * @param gz 四柱干支结果
 * @param jieqiName 当前节气名
 * @returns 排局字符串，如 "阳九局上"
 */
export function qimenJuChaibu(
  gz: GanzhiResult,
  jieqiName: string
): string {
  // 1. 判断阴阳遁
  const yinyangDun = getYinyangDun(jieqiName);

  // 2. 根据日柱确定上中下元
  const yuan = findYuen(gz.day);

  // 3. 查节气局数编码
  const jieqiCode = jieqiCodeLookup(jieqiName);

  // 4. 根据元取对应局数
  const juNumber = getJuNumber(yuan, jieqiCode);

  // 5. 组合返回
  return `${yinyangDun}${juNumber}局${yuan}`;
}

/**
 * 获取局日
 * 根据日干判断局日类型
 */
export function qimenJuDay(dayGanzhi: string): string {
  const dayGan = dayGanzhi[0];
  const mapping: Record<string, string> = {
    "甲": "甲己日",
    "己": "甲己日",
    "乙": "乙庚日",
    "庚": "乙庚日",
    "丙": "丙辛日",
    "辛": "丙辛日",
    "丁": "丁壬日",
    "壬": "丁壬日",
    "戊": "戊癸日",
    "癸": "戊癸日",
  };
  return mapping[dayGan] || "";
}

/**
 * 获取时干支的值符信息
 * 返回旬首和六仪
 */
export function hourGanzhiZhifu(hourGanzhi: string): {
  xunHead: string;  // 旬首，如 "甲子"
  liuYi: string;    // 六仪，如 "戊"
} {
  const xunHead = shun(hourGanzhi);
  const liuYi = getXunYi(xunHead);
  return { xunHead, liuYi };
}

/**
 * 解析排局字符串
 * 例如 "阳九局上" -> { yinyang: "阳", juNumber: "九", yuan: "上" }
 */
export function parseJuString(juString: string): {
  yinyang: "阳" | "阴";
  juNumber: string;
  yuan: "上" | "中" | "下";
} {
  if (juString.length !== 4) {
    throw new Error(`无效的排局字符串: ${juString}`);
  }

  const yinyang = juString[0] as "阳" | "阴";
  const juNumber = juString[1];
  const yuan = juString[3] as "上" | "中" | "下";

  if (yinyang !== "阳" && yinyang !== "阴") {
    throw new Error(`无效的阴阳: ${yinyang}`);
  }
  if (!CNUMBER.includes(juNumber as typeof CNUMBER[number])) {
    throw new Error(`无效的局数: ${juNumber}`);
  }
  if (yuan !== "上" && yuan !== "中" && yuan !== "下") {
    throw new Error(`无效的元: ${yuan}`);
  }

  return { yinyang, juNumber, yuan };
}

/**
 * 获取完整的排局信息
 */
export function getFullJuInfo(
  gz: GanzhiResult,
  jieqiName: string
): {
  juString: string;
  yinyang: "阳" | "阴";
  juNumber: string;
  yuan: "上" | "中" | "下";
  juDay: string;
} {
  const juString = qimenJuChaibu(gz, jieqiName);
  const { yinyang, juNumber, yuan } = parseJuString(juString);
  const juDay = qimenJuDay(gz.day);

  return {
    juString,
    yinyang,
    juNumber,
    yuan,
    juDay,
  };
}
