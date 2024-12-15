import PageHeader from "@/components/card/PageHeader";
import ListCheckIcon from "@/components/icon/ListCheckIcon";
import PlusIcon from "@/components/icon/PlusIcon";
import VerifyIcon from "@/components/icon/VerifyIcon";
import SkeletonGrid from "@/components/loader/SkeletonGrid";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { FormModal } from "@/components/modal/FormModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { cn } from "@/lib/utils";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import { FinancialRecord } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { formatDateToHumanReadable } from "@/utils/dateToString";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  BanknoteIcon,
  CalendarIcon,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { useState } from "react";
import CategoryForm from "./component/form/CategoryForm";
import FieldForm from "./component/form/FieldForm";
import SaleOrExpenseForm from "./component/form/SaleOrExpenseForm";
import FinancialRecordGrid from "./component/grid/FinancialRecordGrid";
import { useNavigate } from "react-router-dom";

const DailySalesBase = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [confirmationModalShow, setconfirmationModalShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formComponent, setFormComponent] = useState<JSX.Element>();

  const [date, setDate] = useState<Date>(new Date());
  const salesAndExpenseService = new SaleAndExpenseService(axiosPrivate);

  const handleAddFieldBtnClick = () => {
    setTitle("Add new Field");
    setDescription("Add new field details to the system");
    setFormComponent(
      <FieldForm
        onClose={() => setShow(false)}
        salesAndExpenseService={salesAndExpenseService}
      />,
    );
    setShow(true);
  };

  const handleAddCategoryBtnClick = () => {
    setTitle("Add new Category");
    setDescription("Add new category details to the system");
    setFormComponent(
      <CategoryForm
        onClose={() => setShow(false)}
        salesAndExpenseService={salesAndExpenseService}
      />,
    );
    setShow(true);
  };

  const handleAddSaleOrExpenseBtnClick = () => {
    setTitle("Add new Sale or Expense");
    setDescription("Add new sale or expense details to the system");
    setFormComponent(
      <SaleOrExpenseForm
        date={formattedDate()}
        onClose={() => setShow(false)}
        salesAndExpenseService={salesAndExpenseService}
      />,
    );
    setShow(true);
  };

  const formattedDate = () => {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate()}`;
  };

  const { data: summery, isLoading } = useQuery({
    queryKey: ["dailySummery", date],
    queryFn: () => salesAndExpenseService.fetchDailySummery(formattedDate()),
    retry: 1,
  });

  const createVerifyMutation = useMutation({
    mutationFn: () =>
      salesAndExpenseService.verifyDailySalesAndExpenses(formattedDate()),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["dailySummery"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully verified sales and expensess",
      });
      setconfirmationModalShow(false);
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Verification is failed",
        description: data.message,
        duration: 5000,
      });
    },
  });

  const financialRecords: FinancialRecord[] = [];
  if (summery !== undefined) {
    summery.financialRecords.forEach((s) => financialRecords.push(s));
  }

  const handlePrint = () => {
    if (summery) {
      navigate("print-page", {
        state: { summary: summery, financialRecords: financialRecords },
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No summary data available for printing.",
      });
    }
  };

  return (
    <div className="mr-2 ml-2 mb-4">
      <CardHeader>
        <PageHeader
          title="Daily Sales and Expenses"
          description="Manage all details related to daily sales and expenses."
          icon={<ListCheckIcon height="30" width="28" color="#162a3b" />}
        />
      </CardHeader>
      <CardContent style={{ width: "98%" }}>
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4 mb-4">
          <Button
            className="flex items-center gap-1 w-full sm:w-auto"
            onClick={handleAddSaleOrExpenseBtnClick}
          >
            <PlusIcon height="24" width="24" color="#fff" />
            Sale or Expense
          </Button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              className="flex items-center gap-1 w-full sm:w-auto"
              onClick={handleAddFieldBtnClick}
            >
              <PlusIcon height="24" width="24" color="#fff" />
              Field
            </Button>
            <Button
              className="flex items-center gap-1 w-full sm:w-auto"
              onClick={handleAddCategoryBtnClick}
            >
              <PlusIcon height="24" width="24" color="#fff" />
              Category
            </Button>
          </div>
        </div>
        <div className="d-flex justify-end mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {isLoading ? (
          <SkeletonGrid noOfColumns={5} noOfItems={2} />
        ) : (
          <FinancialRecordGrid financialRecords={financialRecords} />
        )}
      </CardContent>

      <Card className="m-8 pl-4 p-4 pt-0">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-2 mb-4 mt-0 pt-0">
          <CardTitle className="text-xl font-bold">
            {`Summary of ${formatDateToHumanReadable(date)}`}
          </CardTitle>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {summery !== undefined && summery.verified ? (
              <div
                className="d-flex gap-2 pl-4 pr-4 pt-1 pb-1 w-full sm:w-auto"
                style={{
                  background: "#9ec16c",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <p style={{ color: "#fff" }}>Verified</p>
                <VerifyIcon height="20" width="20" color="#fff" />
              </div>
            ) : (
              <Button
                onClick={() => setconfirmationModalShow(true)}
                className="w-full sm:w-auto"
              >
                <div className="gap-2 d-flex">
                  <VerifyIcon height="20" width="20" color="#fff" />
                  Verify Daily Summary
                </div>
              </Button>
            )}

            <Button
              onClick={handlePrint}
              className="px-4 py-2 text-white rounded w-full sm:w-auto"
            >
              <Printer className="mr-2" />
              Print Daily Summary
            </Button>
          </div>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summery !== undefined ? `Rs. ${summery.saleAmount}` : "Rs. 0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {`Sales count : ${summery !== undefined ? summery.financialRecords.filter((record) => record.type === "SALE").length : 0}`}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summery !== undefined
                  ? `Rs. ${summery.expenseAmount}`
                  : "Rs. 0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {`Expenses count : ${summery !== undefined ? summery.financialRecords.filter((record) => record.type === "EXPENSE").length : 0}`}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Sales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summery !== undefined
                  ? `Rs. ${summery.creditBalance}`
                  : "Rs. 0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {`Credit sales count : ${summery !== undefined ? summery.financialRecords.filter((record) => record.type === "CREDIT_BALANCE").length : 0}`}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unsettled Cheques
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summery !== undefined
                  ? `Rs. ${summery.unsettledChequeAmount}`
                  : "Rs. 0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {`Cheque count : ${summery !== undefined ? summery.financialRecords.filter((record) => record.type === "UNSETTLED_CHEQUE_BALANCE").length : 0}`}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deposit</CardTitle>
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summery !== undefined
                  ? `Rs. ${summery.depositAmount}`
                  : "Rs. 0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {`Cheque count : ${summery !== undefined ? summery.financialRecords.filter((record) => record.type === "DEPOSIT").length : 0}`}
              </p>
            </CardContent>
          </Card>
        </div>
      </Card>

      <FormModal
        title={title}
        titleDescription={description}
        show={show}
        onClose={() => setShow(false)}
        component={formComponent}
      />
      <ConfirmationModal
        onClose={() => setconfirmationModalShow(false)}
        onConfirm={() => createVerifyMutation.mutate()}
        show={confirmationModalShow}
        title={"Verify sales and expenses on " + formattedDate()}
        titleDescription={
          "Do you want to verify sales and expenses on " + formattedDate()
        }
      />
    </div>
  );
};

export default DailySalesBase;
