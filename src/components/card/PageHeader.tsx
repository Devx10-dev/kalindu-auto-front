import { Fragment } from "react";
import { Skeleton } from "../ui/skeleton";

function PageHeader({
  title,
  description,
  icon,
  badge,
  isLoading = false,
}: {
  title: string;
  description: string;
  icon?: JSX.Element;
  badge?: JSX.Element;
  isLoading?: boolean;
}) {
  return (
    <Fragment>
      <div className="d-flex gap-3 align-items-center">
        {icon}
        <div className="flex gap-4 items-center">
          {isLoading ? (
            <Skeleton className="h-8 w-56" />
          ) : (
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {isLoading ? <Skeleton className="h-6 w-16" /> : badge}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-80 mt-2" />
      ) : (
        description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )
      )}
    </Fragment>
  );
}

export default PageHeader;
