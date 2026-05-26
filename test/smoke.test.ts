import { describe, expect, test } from "bun:test";
import { Qimen, QimenInputError } from "../src";

describe("Qimen 脚手架测试", () => {
  test("可以实例化 Qimen 类", () => {
    const qimen = new Qimen({
      year: 2024,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30,
    });
    expect(qimen).toBeInstanceOf(Qimen);
  });

  test("无效的 month 抛出 QimenInputError", () => {
    expect(() => {
      new Qimen({
        year: 2024,
        month: 13,
        day: 15,
        hour: 14,
        minute: 30,
      });
    }).toThrow(QimenInputError);
  });

  test("无效的 hour 抛出 QimenInputError", () => {
    expect(() => {
      new Qimen({
        year: 2024,
        month: 6,
        day: 15,
        hour: 24,
        minute: 30,
      });
    }).toThrow(QimenInputError);
  });

  test("无效的日期（2月30日）抛出 QimenInputError", () => {
    expect(() => {
      new Qimen({
        year: 2024,
        month: 2,
        day: 30,
        hour: 14,
        minute: 30,
      });
    }).toThrow(QimenInputError);
  });

  test("pan() 方法返回完整盘面输出", () => {
    const qimen = new Qimen({
      year: 2024,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30,
    });
    const pan = qimen.pan();

    expect(pan).toEqual({
      method: "拆补",
      ganzhi: "甲辰年庚午月庚戌日癸未时",
      xunHead: "甲戌",
      xunKong: {
        dayKong: "寅卯",
        hourKong: "申酉",
      },
      juDay: "乙庚日",
      ju: "阳六局上",
      jieqi: "芒种",
      zhifuZhishi: {
        zhifuGan: ["甲戌", "己"],
        zhifuStarGong: ["柱", "坤"],
        zhishiDoorGong: ["惊", "兑"],
      },
      tianyi: "己",
      skyPan: {
        坤: "己",
        兑: "戊",
        乾: "壬",
        坎: "庚",
        艮: "丁",
        震: "丙",
        巽: "辛",
        离: "癸",
        中: "乙",
      },
      earthPan: {
        乾: "戊",
        兑: "己",
        艮: "庚",
        离: "辛",
        坎: "壬",
        坤: "癸",
        震: "丁",
        巽: "丙",
        中: "乙",
      },
      doorPan: {
        兑: "惊",
        乾: "开",
        坎: "休",
        艮: "生",
        震: "伤",
        巽: "杜",
        离: "景",
        坤: "死",
      },
      starPan: {
        坤: "柱",
        兑: "心",
        乾: "蓬",
        坎: "任",
        艮: "冲",
        震: "辅",
        巽: "英",
        离: "禽",
      },
      godPan: {
        坤: "符",
        兑: "蛇",
        乾: "阴",
        坎: "合",
        艮: "勾",
        震: "雀",
        巽: "地",
        离: "天",
      },
      anganPan: {
        兑: "癸",
        艮: "丁",
        离: "丙",
        坎: "乙",
        坤: "戊",
        震: "己",
        巽: "庚",
        中: "辛",
        乾: "壬",
      },
      maXing: {
        tianMa: "戌",
        dingMa: "未",
        yiMa: "巳",
      },
      changshengYun: {
        skyPan: {
          坤: {
            gan: "己",
            changsheng: {
              未: "冠带",
              申: "沐浴",
            },
          },
          兑: {
            gan: "戊",
            changsheng: {
              酉: "死",
            },
          },
          乾: {
            gan: "壬",
            changsheng: {
              戌: "冠带",
              亥: "临冠",
            },
          },
          坎: {
            gan: "庚",
            changsheng: {
              子: "死",
            },
          },
          艮: {
            gan: "丁",
            changsheng: {
              丑: "墓",
              寅: "死",
            },
          },
          震: {
            gan: "丙",
            changsheng: {
              卯: "沐浴",
            },
          },
          巽: {
            gan: "辛",
            changsheng: {
              辰: "墓",
              巳: "死",
            },
          },
          离: {
            gan: "癸",
            changsheng: {
              午: "绝",
            },
          },
          中: {
            gan: "乙",
            changsheng: {
              辰: "冠带",
            },
          },
        },
        earthPan: {
          乾: {
            gan: "戊",
            changsheng: {
              戌: "墓",
              亥: "绝",
            },
          },
          兑: {
            gan: "己",
            changsheng: {
              酉: "长生",
            },
          },
          艮: {
            gan: "庚",
            changsheng: {
              丑: "墓",
              寅: "绝",
            },
          },
          离: {
            gan: "辛",
            changsheng: {
              午: "病",
            },
          },
          坎: {
            gan: "壬",
            changsheng: {
              子: "帝旺",
            },
          },
          坤: {
            gan: "癸",
            changsheng: {
              未: "墓",
              申: "死",
            },
          },
          震: {
            gan: "丁",
            changsheng: {
              卯: "病",
            },
          },
          巽: {
            gan: "丙",
            changsheng: {
              辰: "冠带",
              巳: "临冠",
            },
          },
          中: {
            gan: "乙",
            changsheng: {
              辰: "冠带",
            },
          },
        },
      },
      menpo: [],
      jixing: [
        {
          gong: "艮",
          gan: "甲申庚",
        },
        {
          gong: "离",
          gan: "甲午辛",
        },
        {
          gong: "坤",
          gan: "甲寅癸",
        },
        {
          gong: "坤",
          gan: "甲戌己",
        },
      ],
    });
  });
});
