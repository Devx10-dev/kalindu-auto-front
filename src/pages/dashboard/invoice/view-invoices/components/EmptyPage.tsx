import empty from "../../../../../assets/empty.png";

export function EmptyPage({ emptyMessage }: { emptyMessage: string }) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src={empty}
          alt="empty"
          className="w-80 h-80 grayscale opacity-50"
        />
        <h1 className="text-3xl font-semibold text-gray-800 mt-4">
          No Data Found
        </h1>
        <p className="text-sm text-gray-500 mt-2">{emptyMessage}</p>
      </div>
    </div>
  );
}
