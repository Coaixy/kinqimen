<div align="center">

# 堅奇门 · KinQiMen

TypeScript 时家奇门拆补法排盘库。

[![npm](https://img.shields.io/npm/v/kinqimen?label=npm&logo=npm)](https://www.npmjs.com/package/kinqimen)
[![License](https://img.shields.io/github/license/kentang2017/kinqimen?label=License)](LICENSE)

</div>

## 功能

- 时家奇门拆补法排盘。
- 支持干支、旬首旬空、局日、排局、节气、值符值使。
- 输出天盘、地盘、八门、九星、八神、暗干。
- 输出天乙、马星、长生运、门迫、击刑等辅助信息。
- 基于 `tyme4ts` 做历法换算，23:00 子时按次日处理。

## 安装

```bash
npm install kinqimen
```

也可以使用其他包管理器：

```bash
bun add kinqimen
pnpm add kinqimen
yarn add kinqimen
```

## 快速开始

```typescript
import { Qimen } from "kinqimen";

const qimen = new Qimen({
  year: 2024,
  month: 6,
  day: 15,
  hour: 14,
  minute: 30,
});

const pan = qimen.pan();

console.log(pan.排局);
console.log(pan.值符值使);
console.log(pan.暗干);
```

## API

### `new Qimen(input)`

创建一个排盘实例。

```typescript
type QimenDateInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};
```

参数必须是公历时间：

- `year`：整数年份。
- `month`：1-12。
- `day`：1-31，并会校验实际日期是否合法。
- `hour`：0-23。
- `minute`：0-59。

输入不合法时会抛出 `QimenInputError`。

### `qimen.pan()`

计算并返回时家奇门拆补盘。

```typescript
import { Qimen } from "kinqimen";
import type { HourChabuPan } from "kinqimen";

const pan: HourChabuPan = new Qimen({
  year: 2024,
  month: 6,
  day: 15,
  hour: 14,
  minute: 30,
}).pan();
```

返回字段包括：

```typescript
type HourChabuPan = {
  排盘方式: "拆补";
  干支: string;
  旬首: string;
  旬空: { 日空: string; 时空: string };
  局日: string;
  排局: string;
  节气: string;
  值符值使: {
    值符天干: [string, string];
    值符星宫: [string, string];
    值使门宫: [string, string];
  };
  天乙: string;
  天盘: Partial<Record<Gong, string>>;
  地盘: Record<Gong, string>;
  门: Partial<Record<EightGong, string>>;
  星: Partial<Record<EightGong, string>>;
  神: Partial<Record<EightGong, string>>;
  暗干: Record<Gong, string>;
  马星: { 天马: string; 丁马: string; 驿马: string };
  长生运: {
    天盘: Record<string, unknown>;
    地盘: Record<string, unknown>;
  };
  门迫: Array<Record<string, string>>;
  击刑: Array<Record<string, string>>;
};
```

其中 `Gong` 和 `EightGong` 可从包中作为 TypeScript 类型导入。

## 输出示例

```json
{
  "排盘方式": "拆补",
  "干支": "甲辰年庚午月庚戌日癸未时",
  "旬首": "甲戌",
  "旬空": { "日空": "寅卯", "时空": "申酉" },
  "局日": "乙庚日",
  "排局": "阳六局上",
  "节气": "芒种",
  "值符值使": {
    "值符天干": ["甲戌", "己"],
    "值符星宫": ["柱", "坤"],
    "值使门宫": ["惊", "兑"]
  },
  "天乙": "己",
  "天盘": { "坤": "己", "兑": "戊", "乾": "壬", "坎": "庚", "艮": "丁", "震": "丙", "巽": "辛", "离": "癸", "中": "乙" },
  "地盘": { "乾": "戊", "兑": "己", "艮": "庚", "离": "辛", "坎": "壬", "坤": "癸", "震": "丁", "巽": "丙", "中": "乙" },
  "门": { "兑": "惊", "乾": "开", "坎": "休", "艮": "生", "震": "伤", "巽": "杜", "离": "景", "坤": "死" },
  "星": { "坤": "柱", "兑": "心", "乾": "蓬", "坎": "任", "艮": "冲", "震": "辅", "巽": "英", "离": "禽" },
  "神": { "坤": "符", "兑": "蛇", "乾": "阴", "坎": "合", "艮": "勾", "震": "雀", "巽": "地", "离": "天" },
  "暗干": { "兑": "癸", "艮": "丁", "离": "丙", "坎": "乙", "坤": "戊", "震": "己", "巽": "庚", "中": "辛", "乾": "壬" },
  "马星": { "天马": "戌", "丁马": "未", "驿马": "巳" },
  "长生运": { "天盘": {}, "地盘": {} },
  "门迫": [],
  "击刑": [
    { "宫1": "甲申庚", "宫2": "艮", "类型": "申寅刑(无恩之刑)" },
    { "宫1": "甲午辛", "宫2": "离", "类型": "午午刑(自刑)" },
    { "宫1": "甲寅癸", "宫2": "坤", "类型": "寅申刑(无恩之刑)" },
    { "宫1": "甲戌己", "宫2": "坤", "类型": "戌未刑(持势之刑)" }
  ]
}
```

`长生运` 实际会返回每个天干对应的十二长生明细，上面仅做结构省略。

## 类型导出

```typescript
import {
  Qimen,
  QimenInputError,
  QimenCalendarError,
  QimenRuleError,
} from "kinqimen";

import type {
  QimenDateInput,
  HourChabuPan,
  ZhifuZhishi,
  MaXing,
  XunKong,
  Tiangan,
  Dizhi,
  Gong,
  EightGong,
  YinyangDun,
  Yuan,
  Door,
  Star,
  God,
} from "kinqimen";
```

## 本地开发

```bash
bun install
bun test
bun run typecheck
bun run build
```

发布前可运行完整检查：

```bash
bun run prepublishOnly
```

## License

[GPL-3.0-only](LICENSE)
