import { Skeleton } from "../ui/skeleton";

const SkeletonGrid = ({
  noOfItems,
  noOfColumns,
}: {
  noOfItems: number;
  noOfColumns: number;
}) => (
  <table className="skeleton-table">
    <thead>
      <tr>
        {Array.from({ length: noOfColumns }).map((_, index) => (
          <th key={index}>
            <Skeleton className="skeleton-header" />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: noOfItems }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: noOfColumns }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton className="skeleton-cell" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SkeletonGrid;
