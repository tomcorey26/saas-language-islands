import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// TODO: fix the fixed navbar on mobile
export function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center justify-between container font-semibold">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <BrandLogo />
          </Link>
          {/* Desktop only */}
          <Link className="text-lg hidden md:block" href="/#pricing">
            Pricing
          </Link>
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="flex items-center gap-6">
          <Link className="text-lg" href="/dashboard">
            <Button variant="cta">Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
