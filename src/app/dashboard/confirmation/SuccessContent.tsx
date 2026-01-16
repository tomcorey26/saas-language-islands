"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Coins } from "lucide-react";
import Link from "next/link";

interface SuccessContentProps {
  tokensAdded?: number;
}

export function SuccessContent({ tokensAdded }: SuccessContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className={`max-w-sm w-full transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Animated checkmark */}
        <div className="flex justify-center mb-6">
          <div
            className={`relative transition-all duration-500 delay-200 ${
              mounted ? "scale-100" : "scale-0"
            }`}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            <div
              className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-10"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>

        {/* Text content */}
        <div
          className={`text-center mb-6 transition-all duration-500 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 text-sm">Your tokens are ready to use</p>
        </div>

        {/* Token badge */}
        {tokensAdded && (
          <div
            className={`mb-6 transition-all duration-500 delay-400 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                    Added to account
                  </p>
                  <p className="text-2xl font-bold text-amber-900">
                    +{tokensAdded.toLocaleString()}
                    <span className="text-base font-medium ml-1">tokens</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div
          className={`space-y-2 transition-all duration-500 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/dashboard" className="block">
            <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div
          className={`mt-6 transition-all duration-500 delay-600 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs text-center text-gray-400">
            Your token balance may take a moment to update.
            <br />
            Navigate to a new page to see the latest balance.
          </p>
        </div>
      </div>
    </div>
  );
}
