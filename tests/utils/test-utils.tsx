import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

/**
 * Custom render function that wraps components with common providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  // Add custom options here if needed
}

function AllTheProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { customRender as render };
