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
import QuickSearch from "./components/QuickSearch";

export function MainDashboard() {
  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          {/* Quick Access Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <div className="hidden md:block">
            <QuickSearch />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <CreditorStatPieChart />
          <CreditorCard className="max-h-[400px] mt-4 mb-5" />
        </div>
      </div>
    </Fragment>
  );
}
