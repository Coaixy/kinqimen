<div align="center">

# 🔮 堅奇门 · KinQiMen

### 奇门遁甲排盘系统

[![Python](https://img.shields.io/pypi/pyversions/kinqimen?label=Python&logo=python)](https://pypi.org/project/kinqimen/)
[![PyPI](https://img.shields.io/pypi/v/kinqimen?label=PyPI&logo=pypi)](https://pypi.org/project/kinqimen/)
[![npm](https://img.shields.io/npm/v/kinqimen?label=npm&logo=npm)](https://www.npmjs.com/package/kinqimen)
[![License](https://img.shields.io/github/license/kentang2017/kinqimen?label=License)](LICENSE)

</div>

---

## 功能对比

| 功能 | Python | TypeScript |
|---|:---:|:---:|
| 时家奇门（拆补法） | ✅ | ✅ |
| 时家奇门（置闰法） | ✅ | ❌ |
| 刻家奇门 | ✅ | ❌ |
| 金函玉镜 | ✅ | ❌ |
| 长生运 | ✅ | ✅ |
| 门迫 / 击刑 | ❌ | ✅ |

---

## 安装

```bash
# Python
pip install sxtwl kinqimen

# TypeScript / JavaScript
npm install kinqimen
```

---

## 使用

### Python

```python
from kinqimen import kinqimen

result = kinqimen.Qimen(2024, 6, 15, 14, 30).pan(1)  # 1=拆补, 2=置闰
```

### TypeScript

```typescript
import { Qimen } from "kinqimen";

const pan = new Qimen({
  year: 2024, month: 6, day: 15, hour: 14, minute: 30
}).pan();
```

---

## TypeScript 输出

```json
{
  "排盘方式": "拆补",
  "干支": "丙午年壬辰月庚申日壬午时",
  "旬首": "甲戌",
  "旬空": { "日空": "子丑", "时空": "申酉" },
  "局日": "乙庚日",
  "排局": "阳七局下",
  "节气": "清明",
  "值符值使": {
    "值符天干": ["甲戌", "己"],
    "值符星宫": ["任", "坤"],
    "值使门宫": ["生", "兑"]
  },
  "天乙": "己",
  "天盘": { "坤": "己", "兑": "癸", "乾": "丁", "坎": "庚", "艮": "壬", "震": "戊", "巽": "乙", "离": "辛", "中": "丙" },
  "地盘": { "兑": "戊", "艮": "己", "离": "庚", "坎": "辛", "坤": "壬", "震": "癸", "巽": "丁", "中": "丙", "乾": "乙" },
  "门": { "兑": "生", "乾": "伤", "坎": "杜", "艮": "景", "震": "死", "巽": "惊", "离": "开", "坤": "休" },
  "星": { "坤": "任", "兑": "冲", "乾": "辅", "坎": "英", "艮": "禽", "震": "柱", "巽": "心", "离": "蓬" },
  "神": { "坤": "符", "兑": "蛇", "乾": "阴", "坎": "合", "艮": "勾", "震": "雀", "巽": "地", "离": "天" },
  "马星": { "天马": "午", "丁马": "巳", "驿马": "申" },
  "长生运": { "天盘": {...}, "地盘": {...} },
  "门迫": [{ "门": "惊", "宫": "巽", "门五行": "金", "宫五行": "木" }],
  "击刑": [
    { "宫1": "甲戌己", "宫2": "艮", "类型": "戌丑刑(持势之刑)" },
    { "宫1": "甲子戊", "宫2": "震", "类型": "子卯刑(无礼之刑)" },
    { "宫1": "甲午辛", "宫2": "离", "类型": "午午刑(自刑)" }
  ]
}
```

---

## License

[MIT](LICENSE)
