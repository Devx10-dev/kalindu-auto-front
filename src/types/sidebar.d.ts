import { ReactElement } from "react";

export interface NavLinkSublink {
  label: string;
  href: string;
}

export interface NavLink {
  icon?: ReactElement;
  label: string;
  href: string;
  sublinks?: NavLinkSublink[];
}
