/**
 * 奇门遁甲工具函数
 */
/**
 * 从指定元素起循环排列数组
 * 对应 Python new_list()
 *
 * @example
 * rotateFrom(['a','b','c','d'], 'c') // ['c','d','a','b']
 */
export declare function rotateFrom<T>(arr: readonly T[], from: T): T[];
/**
 * 从指定元素起逆序循环排列数组
 * 对应 Python new_list_r()
 *
 * @example
 * rotateFromReverse(['a','b','c','d'], 'c') // ['c','b','a','d']
 */
export declare function rotateFromReverse<T>(arr: readonly T[], from: T): T[];
/**
 * 多 key 字典查找
 * 对应 Python multi_key_dict_get()
 *
 * @example
 * multiKeyGet([[['a','b'], 1], [['c'], 2]], 'b') // 1
 */
export declare function multiKeyGet<V>(entries: [string | string[], V][], key: string): V | undefined;
/**
 * 将数组按指定大小分割
 * 对应 Python split_list()
 */
export declare function splitList<T>(arr: readonly T[], chunkSize: number): T[][];
/**
 * 获取六甲旬首字典
 * 将每个干支映射到其所属的旬首
 *
 * @example
 * liujiashunDict().get('甲子') // '甲子'
 * liujiashunDict().get('乙丑') // '甲子'
 * liujiashunDict().get('癸酉') // '甲子'
 */
export declare function liujiashunDict(): Map<string, string>;
/**
 * 获取干支的旬首
 * 对应 Python shun()
 *
 * @example
 * shun('甲子') // '甲子'
 * shun('乙丑') // '甲子'
 */
export declare function shun(ganzhi: string): string;
/**
 * 获取三元字典
 * 将每个干支映射到上/中/下元
 * 每5个干支为一组，循环上中下
 */
export declare function findYuenDict(): Map<string, "上" | "中" | "下">;
/**
 * 获取干支所属的元（上/中/下）
 *
 * @example
 * findYuen('甲子') // '上'
 * findYuen('己巳') // '上'
 * findYuen('庚午') // '中'
 */
export declare function findYuen(ganzhi: string): "上" | "中" | "下";
/**
 * 获取天干索引（0-9）
 */
export declare function tianGanIndex(gan: string): number;
/**
 * 获取地支索引（0-11）
 */
export declare function diZhiIndex(zhi: string): number;
/**
 * 获取干支在六十甲子中的索引（0-59）
 */
export declare function jiaziIndex(ganzhi: string): number;
/**
 * 获取旬首对应的六仪（值符天干）
 *
 * @example
 * getXunYi('甲子') // '戊'
 * getXunYi('甲戌') // '己'
 */
export declare function getXunYi(xunHead: string): string;
/**
 * 获取干支五行
 */
export declare function getGanzhiWuxing(gangOrZhi: string): string;
/**
 * 五行相生相克关系
 */
export declare function findWuxingRelation(wx1: string, wx2: string): string;
