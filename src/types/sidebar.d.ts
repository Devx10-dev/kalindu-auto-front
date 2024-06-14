export interface NavLinkSublink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  sublinks?: NavLinkSublink[];
}
