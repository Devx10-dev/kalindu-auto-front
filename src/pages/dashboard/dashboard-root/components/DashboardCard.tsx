import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cloneElement, useEffect } from "react";

export default function DashboardCard({
  title,
  content,
  description,
  icon,
  badge,
}: {
  title: string;
  content: string;
  description?: string;
  icon: JSX.Element;
  badge?: JSX.Element;
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
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
