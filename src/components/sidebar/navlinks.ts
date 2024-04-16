// import { BsCashCoin } from "react-icons/bs";
// import { AiOutlineCreditCard } from "react-icons/ai";
// import { MdOutlineInsertPageBreak } from "react-icons/md";
// import { FaRegListAlt } from "react-icons/fa";
// import { GiArchiveRegister } from "react-icons/gi";
// import { FaBalanceScale } from "react-icons/fa";
// import { MdOutlineCreditScore } from "react-icons/md";
// import { PiEngineBold } from "react-icons/pi";
// import { IconType } from "react-icons/lib";

<<<<<<< HEAD
interface NavLinkSublink {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  sublinks?: NavLinkSublink[];
}
=======
import { NavLink } from "@/types/sidebar";

>>>>>>> 81f67c97990a47c271607bd9b51c84531e120b10
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
<<<<<<< HEAD
        label: "View Bills",
        href: "/dashboard/creditors/view-bills",
=======
        label: "Creditor Management",
        href: "/dashboard/creditors/manage",
>>>>>>> 81f67c97990a47c271607bd9b51c84531e120b10
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
<<<<<<< HEAD

  //user-management
  {
    label: "User Management",
    href: "/dashboard/user-management",
    sublinks: [
      {
        label: "Register User",
        href: "/dashboard/user-management/register",
        // icon: <FaBalanceScale />,
=======
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
>>>>>>> 81f67c97990a47c271607bd9b51c84531e120b10
      },
    ],
  },
  // Add more links as needed
];

export default NavLinks;
