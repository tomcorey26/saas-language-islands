"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center justify-between container font-semibold">
        <Link href="/" className="flex-shrink-0">
          <BrandLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link className="text-lg" href="/dashboard">
            Create Islands
          </Link>
          <Link className="text-lg" href="/#pricing">
            Pricing
          </Link>
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
                href="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                Create Islands
              </Link>
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
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
