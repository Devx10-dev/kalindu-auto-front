import { Fragment } from "react";

function PageHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
}) {
  return (
    <Fragment>
      <div className="d-flex gap-3 align-items-center">
        {icon}
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Fragment>
  );
}

export default PageHeader;
