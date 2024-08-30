import PageHeader from "@/components/card/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import {
  Activity,
  Contact,
  CreditCard,
  DollarSign,
  FileText,
  History,
  HomeIcon,
  LayoutDashboard,
  LucideHome,
  NotepadTextDashed,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardCard from "../dashboard-root/components/DashboardCard";
import OverviewChart from "../dashboard-root/components/OverviewChart";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DateRangePicker } from "../invoice/view-invoices/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { getAnalyticalRange } from "@/utils/dateRangeUtil";
import { AnalyticalRange } from "@/types/analytics/dateRangeTypes";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dateToString from "@/utils/dateToString";
import {
  DailySummery,
  TotalSummary,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { useToast } from "@/components/ui/use-toast";
import CreditorCard from "../dashboard-root/components/CreditorCard";
import Clock from "./components/Clock";
import QuickAccessCard from "./components/QuickAccessCard";
import { CreditorStatPieChart } from "./components/CreditorStatPieChart";

export function MainDashboard() {
  return (
    <Fragment>
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
        <CardHeader>
          <PageHeader
            title="Dashboard"
            description=""
            icon={<LayoutDashboard />}
          />
          <CardDescription>
            <p className="text-sm text-muted-foreground">
              Welcome to the Kalindu Auto Dashboard
            </p>
          </CardDescription>
        </CardHeader>
        <div className="flex gap-2 justify-end">
          <Clock />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-4 lg:grid-rows-2 ml-5">
        <div className="grid gap-0 md:grid-cols-2 md:gap-8 lg:grid-cols-2 col-span-2 row-span-1 h-auto">
          <QuickAccessCard
            title="Cash Invoice"
            description="Quick Access to Cash Invoice Creation"
            icon={<FileText className="h-6 w-6 text-primary" />}
            linkTo="/dashboard/invoice/cash"
            // bgImage="https://cdni.iconscout.com/illustration/premium/thumb/money-invoice-11878369-9684535.png?f=webp" // Optional
          />
          <QuickAccessCard
            title="Credit Invoice"
            description="Quick Access to Credit Invoice Creation"
            icon={<CreditCard className="h-6 w-6 text-primary" />}
            linkTo="/dashboard/invoice/creditor"
            // bgImage="/path-to-your-background-image.jpg" // Optional
          />
          <QuickAccessCard
            title="Dummy Invoice"
            description="Quickl Access to Dummy Invoice Creation"
            icon={<NotepadTextDashed className="h-6 w-6 text-primary" />}
            linkTo="/dashboard/invoice/dummy"
            // bgImage="/path-to-your-background-image.jpg" // Optional
          />
          <QuickAccessCard
            title="Manage Creditors"
            description="Quick Access to Creditor Management"
            icon={<Contact className="h-6 w-6 text-primary" />}
            linkTo="/dashboard/creditors/manage"
            // bgImage="/path-to-your-background-image.jpg" // Optional
          />
        </div>
        <div className="w-full col-span-2 row-span-2">
          <CreditorStatPieChart />
          <CreditorCard className="h-400 max-h-[500px] mt-4" />
        </div>
      </div>
    </Fragment>
  );
}
