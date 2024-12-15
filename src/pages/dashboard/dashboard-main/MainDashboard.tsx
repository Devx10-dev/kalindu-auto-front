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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          <CardDescription>
            Welcome to the Kalindu Auto Dashboard
          </CardDescription>
        </CardHeader>
        <div className="flex gap-2 justify-end">
          <Clock />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAccessCard
              title="Cash Invoice"
              description="Quick Access to Cash Invoice Creation"
              icon={<FileText className="h-6 w-6 text-primary" />}
              linkTo="/dashboard/invoice/cash"
            />
            <QuickAccessCard
              title="Credit Invoice"
              description="Quick Access to Credit Invoice Creation"
              icon={<CreditCard className="h-6 w-6 text-primary" />}
              linkTo="/dashboard/invoice/creditor"
            />
            <QuickAccessCard
              title="Dummy Invoice"
              description="Quick Access to Dummy Invoice Creation"
              icon={<NotepadTextDashed className="h-6 w-6 text-primary" />}
              linkTo="/dashboard/invoice/dummy"
            />
            <QuickAccessCard
              title="Manage Creditors"
              description="Quick Access to Creditor Management"
              icon={<Contact className="h-6 w-6 text-primary" />}
              linkTo="/dashboard/creditors/manage"
            />
          </div>
          <div className="hidden md:block">
            <QuickSearch />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-lg shadow">
            <CreditorStatPieChart />
          </div>
          <div className="bg-background rounded-lg shadow">
            <CreditorCard />
          </div>
        </div>
      </div>
    </div>
  );
}
