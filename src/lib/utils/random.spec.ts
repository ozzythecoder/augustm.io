import { describe, it, expect } from "vitest";
import { getRandomElement } from "./random";

describe("getRandomElement", () => {
    const words = ["hello", "world"];

    it("should return an element", () => {
        const r = getRandomElement(words);
        expect(r).toBeOneOf(words);
    });

    it("should not return a duplicate if skipDuplicates is passed", () => {
        const rs = [];
        // 20 runs = 0.000095% chance of false positive
        for (let i = 0; i < 20; i++) {
            const r = getRandomElement(words, true, "hello");
            rs.push(r);
        }
        expect(rs).toContain("world");
        expect(rs.includes("hello")).toBe(false);
    });
});
