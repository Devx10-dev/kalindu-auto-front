import PageHeader from "@/components/card/PageHeader";
import ListCheckIcon from "@/components/icon/ListCheckIcon";
import PlusIcon from "@/components/icon/PlusIcon";
import VerifyIcon from "@/components/icon/VerifyIcon";
import { FormModal } from "@/components/modal/FormModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { cn } from "@/lib/utils";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import { SaleOrExpense as SaleOrExpenseType } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CategoryForm from "./component/form/CategoryForm";
import FieldForm from "./component/form/FieldForm";
import SaleOrExpenseForm from "./component/form/SaleOrExpenseForm";
import SalesAndExpensesGrid from "./component/grid/SalesAndExpensesGrid";
import { toast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";

const DailySalesBase = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

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
      />
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
      />
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
      />
    );
    setShow(true);
  };

  const formattedDate = () => {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate()}`;
  };

  const { data: summery, isLoading } = useQuery({
    queryKey: ["dailySummery", date],
    queryFn: () => salesAndExpenseService.fetchDailySummery(formattedDate()),
    retry: 2,
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

  const salesAndExpenses: SaleOrExpenseType[] = [];
  if (summery !== undefined) {
    summery.sales.forEach((s) =>
      salesAndExpenses.push({
        ...s,
        expense: false,
      })
    );
    summery.expenses.forEach((s) =>
      salesAndExpenses.push({
        ...s,
        expense: true,
      })
    );
  }

  return (
    <Fragment>
      <div className="mr-2 ml-2 mb-4">
        <CardHeader>
          <PageHeader
            title="Daily Sales and Expenses"
            description="Manage all details related to daily sales and expenses."
            icon={<ListCheckIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent style={{ width: "98%" }}>
          <div className="mb-1 d-flex justify-between">
            <Button className="gap-1" onClick={handleAddSaleOrExpenseBtnClick}>
              <PlusIcon height="24" width="24" color="#fff" />
              Sale or Expense
            </Button>
            <div className="mb-3 d-flex gap-4">
              <Button className="gap-1" onClick={handleAddFieldBtnClick}>
                <PlusIcon height="24" width="24" color="#fff" />
                Field
              </Button>
              <Button className="gap-1" onClick={handleAddCategoryBtnClick}>
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
                    !date && "text-muted-foreground"
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
            <Loading />
          ) : (
            <SalesAndExpensesGrid salesOrExpenses={salesAndExpenses} />
          )}
        </CardContent>

        <Card className="m-8 pl-4 p-4 pt-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4 mt-0 pt-0">
            <CardTitle className="text-xl font-bold">Daily Summery</CardTitle>
            {summery !== undefined && summery.verified ? (
              <div
                className="d-flex gap-2 pl-4 pr-4 pt-1 pb-1"
                style={{
                  background: "#9ec16c",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <p style={{ color: "#fff" }}>Verified</p>{" "}
                <VerifyIcon height="20" width="20" color="#fff" />
              </div>
            ) : (
              <Button onClick={() => setconfirmationModalShow(true)}>
                <div className="gap-2 d-flex">
                  <VerifyIcon height="20" width="20" color="#fff" />
                  Verify Daily Summary
                </div>
              </Button>
            )}
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card
              x-chunk="dashboard-01-chunk-0"
              style={{ background: "rgb(229 231 235)" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summery !== undefined
                    ? summery.salesAmount - summery.expensesAmount + " LKR"
                    : "0 LKR"}
                </div>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-1"
              style={{ background: "rgb(229 231 235)" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summery !== undefined
                    ? summery.salesAmount + " LKR"
                    : "0 LKR"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {`Sales count : ${summery !== undefined ? summery.sales.length : 0}`}
                </p>
              </CardContent>
            </Card>
            <Card
              x-chunk="dashboard-01-chunk-2"
              style={{ background: "rgb(229 231 235)" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summery !== undefined
                    ? summery.expensesAmount + " LKR"
                    : "0 LKR"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {`Expenses count : ${summery !== undefined ? summery.expenses.length : 0}`}
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
    </Fragment>
  );
};

export default DailySalesBase;
