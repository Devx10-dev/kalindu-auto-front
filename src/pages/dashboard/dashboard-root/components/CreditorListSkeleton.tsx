import { Skeleton } from "@/components/ui/skeleton";

function CreditorsListSkeleton({ load_count = 6 }: { load_count: number }) {
  const arr = Array.from({ length: load_count }, (_, i) => i);

  return (
    <div className="flex-row gap-3">
      {arr.map((i) => (
        <Skeleton key={i} className="h-16 w-full mb-2" />
      ))}
    </div>
  );
}

export default CreditorsListSkeleton;
