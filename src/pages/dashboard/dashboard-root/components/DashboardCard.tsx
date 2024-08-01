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

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {styledIcon}
      </CardHeader>
      <CardContent>
        {/* {isLoading || content.length === 0 ? (
          // <div className="flex gap-2">
            <Skeleton className="w-20 h-7" />
          // </div>
        ) : ( */}
          <div className="text-2xl font-bold">{content}</div>
        {/* )} */}
        {/* <div className="text-2xl font-bold">{content}</div> */}
        {isLoading ? (
          <></>
        ) : (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}  
      </CardContent>
    </Card>
  );
}
