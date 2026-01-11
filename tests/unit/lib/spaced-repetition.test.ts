import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculateNextReview } from "@/lib/spaced-repetition";

describe("spaced-repetition", () => {
  beforeEach(() => {
    // Mock the current time to a fixed date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("calculateNextReview", () => {
    it("returns 1 minute later for 'again' difficulty", () => {
      const result = calculateNextReview("again");
      const expected = new Date("2024-01-01T12:01:00Z");
      expect(result.getTime()).toBe(expected.getTime());
    });

    it("returns 5 minutes later for 'difficult' difficulty", () => {
      const result = calculateNextReview("difficult");
      const expected = new Date("2024-01-01T12:05:00Z");
      expect(result.getTime()).toBe(expected.getTime());
    });

    it("returns 10 minutes later for 'good' difficulty", () => {
      const result = calculateNextReview("good");
      const expected = new Date("2024-01-01T12:10:00Z");
      expect(result.getTime()).toBe(expected.getTime());
    });

    it("returns 30 minutes later for 'easy' difficulty", () => {
      const result = calculateNextReview("easy");
      const expected = new Date("2024-01-01T12:30:00Z");
      expect(result.getTime()).toBe(expected.getTime());
    });

    it("returns a Date object", () => {
      const result = calculateNextReview("good");
      expect(result).toBeInstanceOf(Date);
    });
  });
});
