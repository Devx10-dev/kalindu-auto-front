import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton({
  noHeader = false,
  cols,
  rows,
}: {
  noHeader?: boolean;
  cols: number;
  rows: number;
}) {
  // skeleton for table body each cell
  return (
    <div className="w-full">
      <Table className="border rounded-md text-md mb-5 table-responsive">
        {!noHeader && (
          <>
            <TableCaption>
              <Skeleton className="w-full h-10" />
            </TableCaption>
            <TableHeader>
              <TableRow>
                {Array.from({ length: cols }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="w-full h-10" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: cols }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton className="w-full h-6" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableBodySkeleton({
  noHeader = false,
  cols,
  rows,
}: {
  noHeader?: boolean;
  cols: number;
  rows: number;
}) {
  // skeleton for table body each cell
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: cols }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton className="w-full h-6" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
