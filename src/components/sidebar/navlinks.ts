import { NavLink } from "@/types/sidebar";

const NavLinks: NavLink[] = [
  {
    label: "Home",
    href: "/dashboard",
    sublinks: [
      {
        label: "Home",
        href: "/dashboard/home",
      },
      {
        label: "Anlytics",
        href: "/dashboard/analytics",
      },
    ],
  },
  {
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
        label: "Create Dummy Invoice",
        href: "/dashboard/invoice/dummy",
      },
      {
        label: "View Invoices",
        href: "/dashboard/invoice/all",
      },
    ],
  },
  {
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
    ],
  },
  {
    label: "Summary",
    href: "/reports",
    sublinks: [
      {
        label: "Daily Sales and Expenses",
        href: "/dashboard/reports/daily-sales",
      },
    ],
  },

  //user-management
  {
    label: "Users",
    href: "/dashboard/users",
    sublinks: [
      {
        label: "Manage Users",
        href: "/dashboard/users/list",
      },
      {
        label: "Register User",
        href: "/dashboard/users/register",
      },
    ],
  },

  {
    label: "Spare Part Inventory",
    href: "/creditors",
    sublinks: [
      {
        label: "Vehicles",
        href: "/dashboard/vehicle/model",
      },
      {
        label: "Spare Parts",
        href: "/dashboard/vehicle/part",
      },
    ],
  },

  {
    label: "Logs",
    href: "/log",
    sublinks: [
      {
        label: "Activity Logs",
        href: "/dashboard/log/activity",
      },
    ],
  },
  // Add more links as needed
];

export default NavLinks;
