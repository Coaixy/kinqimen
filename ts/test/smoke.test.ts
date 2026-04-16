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
    expect(pan.排盘方式).toBe("拆补");
    expect(pan.干支).toBeDefined();
    expect(pan.旬首).toBeDefined();
    expect(pan.旬空).toBeDefined();
    expect(pan.局日).toBeDefined();
    expect(pan.排局).toBeDefined();
    expect(pan.节气).toBeDefined();
    expect(pan.值符值使).toBeDefined();
    expect(pan.天乙).toBeDefined();
    expect(pan.天盘).toBeDefined();
    expect(pan.地盘).toBeDefined();
    expect(pan.门).toBeDefined();
    expect(pan.星).toBeDefined();
    expect(pan.神).toBeDefined();
    expect(pan.马星).toBeDefined();
  });
});
