import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { BrandLogo } from "@/components/BrandLogo";

describe("BrandLogo", () => {
  it("renders logo image without text by default", () => {
    render(<BrandLogo />);
    const logo = screen.getByAltText("Speech Islands");
    expect(logo).toBeInTheDocument();
    expect(screen.queryByText("Speech Islands")).not.toBeInTheDocument();
  });

  it("renders logo with text when withText prop is true", () => {
    render(<BrandLogo withText />);
    const logo = screen.getByAltText("Speech Islands");
    const text = screen.getByText("Speech Islands");
    expect(logo).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BrandLogo withText className="custom-class" />
    );
    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("uses default size of 32", () => {
    render(<BrandLogo />);
    const logo = screen.getByAltText("Speech Islands");
    expect(logo).toHaveAttribute("width", "32");
    expect(logo).toHaveAttribute("height", "32");
  });

  it("applies custom size", () => {
    render(<BrandLogo size={64} />);
    const logo = screen.getByAltText("Speech Islands");
    expect(logo).toHaveAttribute("width", "64");
    expect(logo).toHaveAttribute("height", "64");
  });
});
