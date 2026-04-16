/**
 * 长生运计算
 */
/**
 * 获取某天干的十二长生表
 * 五阳干（甲丙戊庚壬）顺排，五阴干（乙丁己辛癸）逆排
 *
 * @param gan 天干
 * @returns 地支 -> 长生状态 映射
 */
export declare function getShierChangsheng(gan: string): Record<string, string>;
/**
 * 获取某干支的长生状态
 *
 * @param ganzhi 干支
 * @returns 长生状态
 */
export declare function getChangshengState(ganzhi: string): string;
/**
 * 构建长生运
 * 计算天盘和地盘各宫的长生状态
 *
 * @param skyPan 天盘
 * @param earthPan 地盘
 * @param dayGanzhi 日干支
 * @returns 长生运结果
 */
export declare function buildChangshengYun(skyPan: Record<string, string>, earthPan: Record<string, string>, dayGanzhi: string): {
    天盘: Record<string, Record<string, string>>;
    地盘: Record<string, Record<string, string>>;
};
/**
 * 获取天乙
 * 从值符值使中提取天乙信息
 */
export declare function calcTianyi(zhifuZhishi: {
    值符天干: [string, string];
    值符星宫: [string, string];
}): string;
