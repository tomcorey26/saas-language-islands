import { Skeleton } from "@/components/ui/skeleton";

export default function StudyLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2 text-center">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>

        {/* Mode cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="space-y-4 p-8 border-2 rounded-xl"
            >
              <Skeleton className="h-16 w-16 rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>

        {/* Keyboard hint skeleton */}
        <div className="hidden md:flex justify-center">
          <Skeleton className="h-6 w-64" />
        </div>
      </div>
    </div>
  );
}
