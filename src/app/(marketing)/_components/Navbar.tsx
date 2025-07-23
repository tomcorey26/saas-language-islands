"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

// TODO: make this responsve without javascript
export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center justify-between container font-semibold">
        {/* Left side - Logo and Pricing */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <BrandLogo />
          </Link>
          <Link className="text-lg hidden md:block" href="/#pricing">
            Pricing
          </Link>
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="hidden md:flex items-center gap-6">
          <span className="text-lg">
            <SignedIn>
              <div className="flex items-center">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton>Login</SignInButton>
            </SignedOut>
          </span>
          <Link className="text-lg" href="/dashboard">
            <Button variant="cta">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <div className="flex flex-col gap-6 mt-8">
              <Link
                className="text-lg font-semibold"
                href="/#pricing"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="text-lg">
                <SignedIn>
                  <div className="flex items-center">
                    <UserButton />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton>Login</SignInButton>
                </SignedOut>
              </div>
              <Link
                className="text-lg font-semibold"
                href="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full animate-pulse-scale bg-gradient-to-r from-blue-800 to-teal-500 border-0 text-white hover:from-blue-900 hover:to-teal-600 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
