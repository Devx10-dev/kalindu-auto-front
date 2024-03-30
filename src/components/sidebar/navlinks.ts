// import { BsCashCoin } from "react-icons/bs";
// import { AiOutlineCreditCard } from "react-icons/ai";
// import { MdOutlineInsertPageBreak } from "react-icons/md";
// import { FaRegListAlt } from "react-icons/fa";
// import { GiArchiveRegister } from "react-icons/gi";
// import { FaBalanceScale } from "react-icons/fa";
// import { MdOutlineCreditScore } from "react-icons/md";
// import { PiEngineBold } from "react-icons/pi";
// import { IconType } from "react-icons/lib";

interface NavLinkSublink {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  sublinks?: NavLinkSublink[];
}
const NavLinks: NavLink[] = [
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    sublinks: [
      {
        label: "Create Cash Invoice",
        href: "/dashboard/invoices/create/cash-invoice",
        // icon: <BsCashCoin />,
      },
      {
        label: "Create Creditor Invoice",
        href: "/dashboard/invoices/create/creditor-invoice",
        // icon: <AiOutlineCreditCard />,
      },
      {
        label: "Create Dummy Invoice",
        href: "/dashboard/invoices/create/dummy-invoice",
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
        href: "/dashboard/reports/daily-sales-expenses",
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
  // Add more links as needed
];

export default NavLinks;
