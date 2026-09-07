import { createPictureMatchGuestId, isPictureMatchGuestId } from "./pictureMatchGuest";
import { describe, expect, it } from "vitest";

describe("圖片文字配對匿名訪客編號", () => {
  it("以隨機位元組產生固定格式的匿名編號", () => {
    expect(createPictureMatchGuestId(new Uint8Array([0, 16, 32, 48, 64, 255]))).toBe("G-0010203040FF");
  });

  it("只接受不含姓名或電郵的隨機訪客編號格式", () => {
    expect(isPictureMatchGuestId("G-1A2B3C4D5E6F")).toBe(true);
    expect(isPictureMatchGuestId("小朋友123")).toBe(false);
    expect(isPictureMatchGuestId("G-1A2B3C4D5E6")).toBe(false);
  });
});
