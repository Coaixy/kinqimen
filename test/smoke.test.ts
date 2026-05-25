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

  test("pan() 方法返回完整盘面", () => {
    const qimen = new Qimen({
      year: 2024,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30,
    });
    const pan = qimen.pan();

    // 验证基本字段
    expect(pan.method).toBe("拆补");
    expect(pan.ganzhi).toBeDefined();
    expect(pan.xunHead).toBeDefined();
    expect(pan.xunKong).toBeDefined();
    expect(pan.juDay).toBeDefined();
    expect(pan.ju).toBeDefined();
    expect(pan.jieqi).toBeDefined();
    expect(pan.zhifuZhishi).toBeDefined();
    expect(pan.tianyi).toBeDefined();
    expect(pan.skyPan).toBeDefined();
    expect(pan.earthPan).toBeDefined();
    expect(pan.doorPan).toBeDefined();
    expect(pan.starPan).toBeDefined();
    expect(pan.godPan).toBeDefined();
    expect(pan.maXing).toBeDefined();
  });
});
