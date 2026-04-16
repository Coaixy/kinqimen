/**
 * 马星计算
 */
/**
 * 计算丁马
 * 根据日干支的旬首确定丁马位置
 *
 * @param dayGanzhi 日干支
 * @returns 丁马地支
 */
export declare function calcDingMa(dayGanzhi: string): string;
/**
 * 计算天马
 * 根据日支确定天马位置
 *
 * @param dayGanzhi 日干支
 * @returns 天马地支
 */
export declare function calcTianMa(dayGanzhi: string): string;
/**
 * 计算驿马
 * 根据时支确定驿马位置
 *
 * @param hourGanzhi 时干支
 * @returns 驿马地支
 */
export declare function calcYiMa(hourGanzhi: string): string;
/**
 * 计算所有马星
 */
export declare function calcAllMa(dayGanzhi: string, hourGanzhi: string): {
    天马: string;
    丁马: string;
    驿马: string;
};
