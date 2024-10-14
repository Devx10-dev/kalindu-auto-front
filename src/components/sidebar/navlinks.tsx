import { NavLink } from "@/types/sidebar";
import {
  CalendarCheck2,
  FileClock,
  GalleryHorizontalEnd,
  HandCoins,
  Home,
  Users,
  Wrench,
} from "lucide-react";

const NavLinks: NavLink[] = [
  {
    icon: <Home />,
    label: "Home",
    href: "/dashboard",
    sublinks: [
      {
        label: "Dashboard",
        href: "/dashboard/home",
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
      },
    ],
  },
  {
    icon: <GalleryHorizontalEnd />,
    label: "Invoices",
    href: "/dashboard/invoices",
    sublinks: [
      {
        label: "Create Cash Invoice",
        href: "/dashboard/invoice/cash",
      },
      {
        label: "Create Creditor Invoice",
        href: "/dashboard/invoice/creditor",
      },
      {
        label: "Create Quotation",
        href: "/dashboard/invoice/quotation",
      },
      {
        label: "View Invoices",
        href: "/dashboard/invoice/all",
      },
      {
        label: "Return Handling",
        href: "/dashboard/return",
      },
    ],
  },
  {
    icon: <HandCoins />,
    label: "Creditors",
    href: "/creditors",
    sublinks: [
      {
        label: "Register Creditor",
        href: "/dashboard/creditors/register",
      },
      {
        label: "Creditor Management",
        href: "/dashboard/creditors/manage",
      },
      {
        label: "Cheque Handling",
        href: "/dashboard/cheque",
      },
      {
        label: "Add Transaction",
        href: "/dashboard/creditors/transaction",
      },
    ],
  },
  {
    icon: <CalendarCheck2 />,
    label: "Summary",
    href: "/reports",
    sublinks: [
      {
        label: "Daily Summary",
        href: "/dashboard/reports/daily-sales",
      },
    ],
  },

  //user-management
  {
    icon: <Users />,
    label: "Users",
    href: "/dashboard/users",
    sublinks: [
      {
        label: "Register User",
        href: "/dashboard/users/register",
      },
      {
        label: "User Management",
        href: "/dashboard/users/list",
      },
    ],
  },

  {
    icon: <Wrench />,
    label: "Spare Parts",
    href: "/creditors",
    sublinks: [
      {
        label: "Vehicle",
        href: "/dashboard/vehicle/model",
      },
      {
        label: "Spare Part",
        href: "/dashboard/vehicle/part",
      },
    ],
  },

  {
    icon: <FileClock />,
    label: "Logs",
    href: "/log",
    sublinks: [
      {
        label: "Activity Log",
        href: "/dashboard/log/activity",
      },
    ],
  },
  // Add more links as needed
];

export default NavLinks;
