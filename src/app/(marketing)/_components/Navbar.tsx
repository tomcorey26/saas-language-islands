"use client";

import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  return (
    <header className="flex py-4 shadow-xl fixed top-0 w-full z-50 bg-background backdrop-blur-md">
      <nav className="flex items-center justify-between container font-semibold">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <BrandLogo withText />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              className="text-sm hover:text-primary transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-sm hover:text-primary transition-colors"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm hover:text-primary transition-colors"
              href="/faq"
            >
              FAQ
            </Link>
            <Link
              className="text-sm hover:text-primary transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Desktop CTA + Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link className="hidden md:block" href="/dashboard">
            <Button variant="cta">Get Started</Button>
          </Link>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col gap-6 mt-8">
          <Link
            href="/about"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/faq"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-4 border-t">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button variant="cta" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
