import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { TokenUsage } from "@/components/TokenUsage";

describe("TokenUsage", () => {
  it("renders the token count", () => {
    render(<TokenUsage availableTokens={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("formats large token counts with commas", () => {
    render(<TokenUsage availableTokens={1000} />);
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });

  it("displays 'Generations Available' text", () => {
    render(<TokenUsage availableTokens={50} />);
    expect(screen.getByText("Generations Available")).toBeInTheDocument();
  });

  it("renders 'Buy Credits' button with correct link", () => {
    render(<TokenUsage availableTokens={25} />);
    const link = screen.getByRole("link", { name: /buy credits/i });
    expect(link).toHaveAttribute("href", "/dashboard/buy");
  });

  it("applies custom className", () => {
    const { container } = render(
      <TokenUsage availableTokens={10} className="custom-class" />
    );
    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("handles zero tokens correctly", () => {
    render(<TokenUsage availableTokens={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
