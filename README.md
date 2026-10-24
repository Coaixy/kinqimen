<div align="center">

# 堅奇门 · KinQiMen

TypeScript 时家奇门排盘库，支持拆补转盘与鸣法飞盘。

[![npm](https://img.shields.io/npm/v/kinqimen?label=npm&logo=npm)](https://www.npmjs.com/package/kinqimen)
[![许可证](https://img.shields.io/github/license/kentang2017/kinqimen?label=%E8%AE%B8%E5%8F%AF%E8%AF%81)](LICENSE)

</div>

## 功能

- 支持时家奇门拆补转盘与鸣法飞盘。
- 支持干支、旬首旬空、局日、排局、节气、值符值使。
- 输出天盘、地盘、门盘、星盘、神盘和暗干，鸣法额外输出暗支。
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

console.log(pan.ju);
console.log(pan.zhifuZhishi);
console.log(pan.anganPan);
```

## 鸣法起盘

调用 `pan("鸣法")` 即可计算鸣法盘：

```typescript
import { Qimen } from "kinqimen";
import type { HourMingfaPan } from "kinqimen";

const pan: HourMingfaPan = new Qimen({
  year: 2024,
  month: 12,
  day: 13,
  hour: 9,
  minute: 31,
}).pan("鸣法");

console.log(pan.method);           // "鸣法"
console.log(pan.ju);               // "阴四局上"
console.log(pan.starPan["中"]);    // "任"
console.log(pan.anganPan["坤"]);   // "癸"
console.log(pan.anzhiPan["坤"]);   // "巳"
```

起盘规则参考 [deminzhang/qimen-go](https://github.com/deminzhang/qimen-go/tree/4d3f58fa0f401b5b3a337f119138e99e90685dda/xuan)
的提交 `4d3f58fa0f401b5b3a337f119138e99e90685dda`，具体约定如下：

- 采用拆补定局，九星、九门均按一至九宫的数序顺飞。
- 九宫均参与排布，中宫不寄其他宫。天芮（`芮`）与天禽（`禽`）分别落宫，门盘包含中门（`中`）。
- 地盘干、天盘干、九神及暗干支按阳遁顺飞、阴遁逆飞。
- 阳遁九神为 `符蛇阴合勾常雀地天`，阴遁九神为 `符蛇阴合虎常玄地天`，其中 `常` 表示太常。
- `anganPan` 对应上游的 `PathGan`，`anzhiPan` 对应 `PathZhi`。一旬十个时辰飞过九宫，最后的 `癸` 会覆盖起宫的 `甲`。

`HourMingfaPan` 包含通用排盘信息和辅助字段，七层盘面均为覆盖九宫的 `Record<Gong, ...>`。
中门按五行属土计算门迫。历法采用本库的 `tyme4ts` 适配器，23:00 子时按次日处理。
与 Go 实现核对盘面时，使用相同的局数和时柱。

调用 `pan()` 或 `pan("拆补")` 返回 `HourChabuPan`。
排盘方式为变量时，可使用导出的 `QimenMethod` 和 `HourQimenPan` 联合类型，通过 `pan.method` 判断结果类型。
传入不支持的排盘方式时，会抛出 `QimenInputError`。

## 接口说明

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

### `qimen.pan(method?)`

默认返回拆补转盘；传入 `"鸣法"` 时返回鸣法飞盘，具体规则见上方“鸣法起盘”。

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
  method: "拆补";
  ganzhi: string;
  xunHead: string;
  xunKong: { dayKong: string; hourKong: string };
  juDay: string;
  ju: string;
  jieqi: string;
  zhifuZhishi: {
    zhifuGan: [string, string];
    zhifuStarGong: [string, string];
    zhishiDoorGong: [string, string];
  };
  tianyi: string;
  skyPan: Partial<Record<Gong, string>>;
  earthPan: Record<Gong, string>;
  doorPan: Partial<Record<EightGong, string>>;
  starPan: Partial<Record<EightGong, string>>;
  godPan: Partial<Record<EightGong, string>>;
  anganPan: Record<Gong, string>;
  maXing: { tianMa: string; dingMa: string; yiMa: string };
  changshengYun: {
    skyPan: Record<string, unknown>;
    earthPan: Record<string, unknown>;
  };
  menpo: Array<Record<string, string>>;
  jixing: Array<Record<string, string>>;
};
```

其中 `Gong` 和 `EightGong` 可从包中作为 TypeScript 类型导入。

## 输出示例

```json
{
  "method": "拆补",
  "ganzhi": "甲辰年庚午月庚戌日癸未时",
  "xunHead": "甲戌",
  "xunKong": { "dayKong": "寅卯", "hourKong": "申酉" },
  "juDay": "乙庚日",
  "ju": "阳六局上",
  "jieqi": "芒种",
  "zhifuZhishi": {
    "zhifuGan": ["甲戌", "己"],
    "zhifuStarGong": ["柱", "坤"],
    "zhishiDoorGong": ["惊", "兑"]
  },
  "tianyi": "己",
  "skyPan": { "坤": "己", "兑": "戊", "乾": "壬", "坎": "庚", "艮": "丁", "震": "丙", "巽": "辛", "离": "癸", "中": "乙" },
  "earthPan": { "乾": "戊", "兑": "己", "艮": "庚", "离": "辛", "坎": "壬", "坤": "癸", "震": "丁", "巽": "丙", "中": "乙" },
  "doorPan": { "兑": "惊", "乾": "开", "坎": "休", "艮": "生", "震": "伤", "巽": "杜", "离": "景", "坤": "死" },
  "starPan": { "坤": "柱", "兑": "心", "乾": "蓬", "坎": "任", "艮": "冲", "震": "辅", "巽": "英", "离": "禽" },
  "godPan": { "坤": "符", "兑": "蛇", "乾": "阴", "坎": "合", "艮": "虎", "震": "玄", "巽": "地", "离": "天" },
  "anganPan": { "兑": "癸", "艮": "丁", "离": "丙", "坎": "乙", "坤": "戊", "震": "己", "巽": "庚", "中": "辛", "乾": "壬" },
  "maXing": { "tianMa": "戌", "dingMa": "未", "yiMa": "巳" },
  "changshengYun": { "skyPan": {}, "earthPan": {} },
  "menpo": [],
  "jixing": [
    { "gong": "艮", "gan": "甲申庚" },
    { "gong": "离", "gan": "甲午辛" },
    { "gong": "坤", "gan": "甲寅癸" },
    { "gong": "坤", "gan": "甲戌己" }
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
  QimenMethod,
  HourChabuPan,
  HourMingfaPan,
  HourQimenPan,
  MingfaDoor,
  MingfaStar,
  MingfaGod,
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

## 许可证

[GPL-3.0-only](LICENSE)

鸣法实现所采用的上游 MIT 授权声明见 [第三方授权说明](THIRD_PARTY_NOTICES.md)。
