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
}: {
  title: string;
  content: string;
  description?: string;
  icon: JSX.Element;
  badge?: JSX.Element;
  isLoading?: boolean;
}) {
  const styledIcon = icon
    ? cloneElement(icon, {
        className:
          `${icon.props.className || ""} h-6 w-6 text-muted-foreground`.trim(),
      })
    : null;

  // useEffect(() => {
  //   console.log("DashboardCard rendered");
  //   console.log("content: ", content);
  // }
  // , [content]);

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
          <div className="text-2xl font-bold">{content}</div>
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
