import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-4xl font-semibold">Island Not Found</h2>
          <p className="text-xl text-muted-foreground">
            Looks like you&apos;ve drifted into uncharted waters! 🏝️
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <Button size="lg" className="font-semibold">
              Return to Safe Harbor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
