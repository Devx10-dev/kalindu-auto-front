import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cloneElement, useEffect } from "react";

export default function DashboardCard({
  title,
  content,
  description,
  icon,
  badge,
  isLoading = false,
  contentType,
}: {
  title: string;
  content: string;
  description?: string;
  icon: JSX.Element;
  badge?: JSX.Element;
  isLoading?: boolean;
  contentType?: string;
}) {
  const styledIcon = icon
    ? cloneElement(icon, {
        className:
          `${icon.props.className || ""} h-6 w-6 text-muted-foreground`.trim(),
      })
    : null;

  function contentRender(contentType: string) {
    // split from firdst dot from the right
    switch (contentType) {
      case "currencyAmount": {
        // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
        const [currency, amount] = content.split(/(?<=\..*)\./);
        return (
          <div className="text-2xl font-bold">
            <span>{currency}</span>
            <span className="text-sm font-bold color-muted-foreground">
              .{amount}
            </span>
          </div>
        );
      }
      default:
        return <div className="text-2xl font-bold">{content}</div>;
    }
  }

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {styledIcon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-40 h-7" />
        ) : content ? (
          contentRender(contentType || "")
        ) : (
          <div className="text-2xl font-bold text-muted-foreground">
            No data
          </div>
        )}
        {!isLoading && description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
}
