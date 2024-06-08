// import { BsCashCoin } from "react-icons/bs";
// import { AiOutlineCreditCard } from "react-icons/ai";
// import { MdOutlineInsertPageBreak } from "react-icons/md";
// import { FaRegListAlt } from "react-icons/fa";
// import { GiArchiveRegister } from "react-icons/gi";
// import { FaBalanceScale } from "react-icons/fa";
// import { MdOutlineCreditScore } from "react-icons/md";
// import { PiEngineBold } from "react-icons/pi";
// import { IconType } from "react-icons/lib";

import { NavLink } from "@/types/sidebar";

const NavLinks: NavLink[] = [
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    sublinks: [
      {
        label: "Create Cash Invoice",
        href: "/dashboard/invoice/cash",
        // icon: <BsCashCoin />,
      },
      {
        label: "Create Creditor Invoice",
        href: "/dashboard/invoice/creditor",
        // icon: <AiOutlineCreditCard />,
      },
      {
        label: "Create Dummy Invoice",
        href: "/dashboard/invoice/dummy",
        // icon: <MdOutlineInsertPageBreak />,
      },
      {
        label: "View Invoices",
        href: "/dashboard/invoices/view-invoices",
        // icon: <FaRegListAlt />,
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
        // icon: <GiArchiveRegister />,
      },
      {
        label: "Creditor Management",
        href: "/dashboard/creditors/manage",
        // icon: <FaRegListAlt />,
      },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    sublinks: [
      {
        label: "Daily Sales and Expenses",
        href: "/dashboard/reports/daily-sales",
        // icon: <FaBalanceScale />,
      },
      {
        label: "Credit Sales",
        href: "/dashboard/reports/credit-sales",
        // icon: <MdOutlineCreditScore />,
      },
      {
        label: "Engine Stock",
        href: "/dashboard/reports/engine-stock",
        // icon: <PiEngineBold />,
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
        href: "/dashboard/users/user-list",
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
        // icon: <GiArchiveRegister />,
      },
      {
        label: "Spare Parts",
        href: "/dashboard/vehicle/part",
        // icon: <FaRegListAlt />,
      },
    ],
  },
  // Add more links as needed
];

export default NavLinks;
