import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex-shrink-0">
              <BrandLogo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Master languages through AI-powered spaced repetition flashcards organized into conversation islands.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/terms-of-service" className="block text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/refund-policy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </Link>
              <Link href="/cookie-policy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <a 
                href="mailto:icongeneratorai@gmail.com" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Email Support
              </a>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Seibert Software Solutions, LLC</p>
              <a 
                href="https://webdevcody.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-foreground transition-colors"
              >
                webdevcody.com
              </a>
              <a 
                href="mailto:icongeneratorai@gmail.com"
                className="block hover:text-foreground transition-colors"
              >
                icongeneratorai@gmail.com
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright and Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Seibert Software Solutions, LLC. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}