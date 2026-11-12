import { describe, expect, it } from "vitest";
import { getLocaleFromPath } from "@/i18n/locale";

describe("getLocaleFromPath", () => {
  it("uses Portuguese at the root", () => expect(getLocaleFromPath("/")).toBe("pt"));
  it("uses English under /en", () => {
    expect(getLocaleFromPath("/en")).toBe("en");
    expect(getLocaleFromPath("/en/projects")).toBe("en");
  });
  it("falls back to Portuguese for unknown prefixes", () => expect(getLocaleFromPath("/english")).toBe("pt"));
});
