import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
