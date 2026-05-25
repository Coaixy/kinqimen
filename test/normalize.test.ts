import { describe, expect, test } from "bun:test";
import { hasTradChars, normalizeChar, normalizeStr } from "../src/core/normalize";

describe("繁简归一化", () => {
  test("转换繁体术语为简体", () => {
    expect(normalizeChar("陽")).toBe("阳");
    expect(normalizeStr("陽遁兌門")).toBe("阳遁兑门");
  });

  test("只把映射内字符识别为繁体", () => {
    expect(hasTradChars("陽遁")).toBe(true);
    expect(hasTradChars("阳遁")).toBe(false);
    expect(hasTradChars("值符")).toBe(false);
  });
});
