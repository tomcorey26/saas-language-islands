import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full p-4 md:p-6 flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-[400px] w-full max-w-2xl rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-24" />
      </div>
    </div>
  );
}
