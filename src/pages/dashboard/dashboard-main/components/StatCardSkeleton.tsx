import { Skeleton } from "@/components/ui/skeleton";


export function StatCardSkeleton() {
  return (
    <div className="h-200 w-full">
      <div className="flex pb-0 px-0">
        <div className="mx-0 aspect-square max-h-[150px] min-w-[150px]" />
        <div className="grid grid-cols-2 grid-rows-2 p-4 gap-x-5 w-full">
          <Skeleton className="flex col-span-1 row-span-1 justify-between">
            <Skeleton>
              <Skeleton />
            </Skeleton>
          </Skeleton>
          <Skeleton className="flex col-span-1 row-span-1 justify-between">
            <Skeleton>
              <Skeleton />
            </Skeleton>
          </Skeleton>
          <Skeleton className="col-span-1 row-span-1">
            <Skeleton>
              <Skeleton />
            </Skeleton>
          </Skeleton>
          <Skeleton className="col-span-1 row-span-1">
            <Skeleton>
              <Skeleton />
            </Skeleton>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}