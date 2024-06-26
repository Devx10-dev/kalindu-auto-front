import error from "../../../../../assets/error.png";

export function ErrorPage({
  errorHeading,
  errorSubHeading,
  errorAction,
}: {
  errorHeading: string;
  errorSubHeading: string;
  errorAction?: JSX.Element;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center h-full">
        {/* mage image grascale  opacity down*/}
        <img
          src={error}
          alt="error"
          className="w-80 h-80 grayscale opacity-50"
        />
        <h1 className="text-3xl font-semibold text-gray-800 mt-4">
          {errorHeading}
        </h1>
        <p className="text-sm text-gray-500 mt-2">{errorSubHeading}</p>
        {errorAction}
      </div>
    </div>
  );
}
