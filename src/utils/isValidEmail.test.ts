import { describe, expect, it } from "vitest";
import { isValidEmail } from "./isValidEmail";

describe("isValidEmail", () => {
  it.each([
    "name@example.com",
    "first.last+tag@sub.example.co.uk",
    "name@b.c",
    "name@.b.c",
    "name@b..c",
    "name@b.c.",
    "name@...",
    "名@例.子",
  ])("accepts the existing permissive format: %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    "",
    "name",
    "@example.com",
    "name@",
    "name@example",
    "name@.com",
    "name@example.",
    "name@..",
    "name@@example.com",
    "name@example.com@",
    "na me@example.com",
    "name@exam\tple.com",
    "name@example.\ncom",
    "name@exam\u00a0ple.com",
    "name@exam\u2028ple.com",
  ])("rejects malformed addresses: %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it("handles the reported repeated-dot input and failing suffixes", () => {
    const email = "!@!." + "!.".repeat(100_000);
    expect(isValidEmail(email)).toBe(true);
    expect(isValidEmail(email + "@")).toBe(false);
    expect(isValidEmail(email + " ")).toBe(false);
    expect(isValidEmail(email + "\u00a0!")).toBe(false);
  });

  it("handles long addresses without a domain dot or an at sign", () => {
    expect(isValidEmail("a@" + "a".repeat(200_000))).toBe(false);
    expect(isValidEmail("!.".repeat(100_000))).toBe(false);
  });
});
