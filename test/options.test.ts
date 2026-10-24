import { describe, expect, test } from "bun:test";
import { Qimen, QimenInputError } from "../src";
import type { QimenPanOptions } from "../src";

describe("Chart and ju options", () => {
  const qimen = new Qimen({ year: 2024, month: 6, day: 15, hour: 14, minute: 30 });

  test("both chart types share Chabu ju calculation and default each option independently", () => {
    const rotating = qimen.pan({ type: "转盘", juMethod: "拆补" });
    const mingfa = qimen.pan({ type: "鸣法", juMethod: "拆补" });

    expect(rotating.type).toBe("转盘");
    expect(mingfa.type).toBe("鸣法");
    expect(rotating.juMethod).toBe("拆补");
    expect(mingfa.juMethod).toBe("拆补");
    expect(rotating.ju).toBe("阳六局上");
    expect(mingfa.ju).toBe(rotating.ju);
    expect(rotating.earthPan).toEqual(mingfa.earthPan);
    expect(qimen.pan()).toEqual(rotating);
    expect(qimen.pan({})).toEqual(rotating);
    expect(qimen.pan({ juMethod: "拆补" })).toEqual(rotating);
    expect(qimen.pan({ type: "转盘" })).toEqual(rotating);
    expect(qimen.pan({ type: "鸣法" })).toEqual(mingfa);
  });

  test.each<{ options: unknown; message: string }>([
    { options: { type: "拆补" }, message: "不支持的盘式: 拆补" },
    { options: { juMethod: "鸣法" }, message: "不支持的定局方法: 鸣法" },
    { options: "拆补", message: "排盘参数必须是配置对象" },
    { options: "鸣法", message: "排盘参数必须是配置对象" },
  ])("rejects invalid options: $options", ({ options, message }) => {
    const calculate = () => qimen.pan(options as QimenPanOptions);
    expect(calculate).toThrow(QimenInputError);
    expect(calculate).toThrow(message);
  });
});
