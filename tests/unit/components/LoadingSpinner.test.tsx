import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@/tests/utils/test-utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with initial progress", () => {
    render(<LoadingSpinner />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("updates progress over time", async () => {
    render(<LoadingSpinner />);
    const progressBar = screen.getByRole("progressbar");

    // Initial state
    expect(progressBar).toHaveAttribute("aria-valuenow", "13");

    // Advance timer by 1 second
    vi.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(progressBar).toHaveAttribute("aria-valuenow", "26");
    });

    // Advance timer by another second
    vi.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(progressBar).toHaveAttribute("aria-valuenow", "39");
    });
  });

  it("stops at 95% after 7 seconds", async () => {
    render(<LoadingSpinner />);
    const progressBar = screen.getByRole("progressbar");

    // Advance timer by 7 seconds
    vi.advanceTimersByTime(7000);
    await waitFor(() => {
      expect(progressBar).toHaveAttribute("aria-valuenow", "95");
    });

    // Advance further and verify it stays at 95
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(progressBar).toHaveAttribute("aria-valuenow", "95");
    });
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = render(<LoadingSpinner />);
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
