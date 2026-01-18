import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-4 h-[80vh] flex flex-col">
      <Skeleton className="h-8 w-48" />
      <div className="flex-1 space-y-4">
        <div className="flex justify-start">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-12 w-1/2 rounded-lg" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-20 w-2/3 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
