import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { z } from "zod";
import CreditorAPI from "../api/CreditorAPI";

const formSchema = z.object({
  invoiceNo: z.string().min(1, "Item name is required"),
  totalPrice: z.number().min(1, "Invalid value"),
  transactionType: z
    .any()
    .refine((val) => val !== "", "Transaction type is required"),
  isPartial: z.any().refine((val) => val !== "", "Required"),
  description: z.string().optional(),
  chequeNo: z.string().optional(),
});

type CreditorTransactionFormValues = z.infer<typeof formSchema>;

export type CreditInvoice = {
  id?: number;
  invoiceId: string;
  issuedTime: number[];
  totalPrice: number;
  totalDiscount?: number;
  vat?: number;
  settledAmount?: number;
  settled?: boolean;
};

const INVOICE_NO_CONST = {
  invoice1: "123456",
};

const transactionTypeData = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "CHEQUE",
    label: "Cheque",
  },
];

const yesNo = [
  {
    value: "YES",
    label: "Yes",
  },
  {
    value: "NO",
    label: "No",
  },
];

export function AddNewTransaction() {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoiceID, setSelectedInvoiceID] = useState<
    number | undefined
  >(undefined);

  // const { isLoading, data } = useQuery({
  //   queryKey: ['creditor', pageNo],
  //   queryFn: () => creditorAPI.fetchSingleCreditor(id),
  // });

  // TODO : fetch creditor invoice numbers and validate the entered invoice number with that numbers

  const onPageChange = (pageNo: number) => {
    setPageNo(pageNo);
    queryClient.invalidateQueries({ queryKey: ["creditors"] });
  };

  const { isLoading, data } = useQuery({
    queryKey: ["creditorInvoiceIDS", id],
    queryFn: () => creditorAPI.fetchCreditorInvoiceIDs(id),
  });

  let invoiceOptions = [];

  if (data && Array.isArray(data) && data.length > 0) {
    invoiceOptions = data.map((invoice) => ({
      value: invoice.invoiceId,
      label: invoice.invoiceId,
    }));
  }

  const createCreditorMutation = useMutation({
    mutationFn: (data: CreditorTransactionFormValues) =>
      creditorAPI.createCreditorTransaction(data),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditorTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["creditor", id] });
      toast({
        variant: "default",
        title: "Success",
        className: " bg-green-200",
        description: "Successfully created Transaction.",
      });
    },
    onError: (data: any) => {
      toast({
        variant: "destructive",
        title: "Creating transaction failed",
        description: data.response.data,
        duration: 5000,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: "",
      totalPrice: "",
      transactionType: "CASH",
      isPartial: "NO",
      description: "",
      chequeNo: "",
    },
  });

  const onSubmit = (data: any) => {
    data = {
      creditorID: id,
      ...data,
    };
    createCreditorMutation.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };

  const resetForm = () => {
    form.reset();
  };

  const invoice = useQuery<CreditInvoice, Error>({
    queryKey: ["creditInvoice", selectedInvoiceID],
    queryFn: () =>
      selectedInvoiceID
        ? creditorAPI.fetchCreditInvoice(selectedInvoiceID)
        : null,
    enabled: selectedInvoiceID !== undefined,
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const invoiceItem = data.find(
        (item: any) => item.invoiceId == value.invoiceNo,
      );
      const invoiceID = invoiceItem?.id;
      setSelectedInvoiceID(invoiceID);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, data]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-10 mb-10">
          <PlusCircle className={"mr-2"} />
          Add New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Add new Transaction</DialogTitle>
          <DialogDescription>
            Add new creditor transaction here by filling out the details below
          </DialogDescription>
        </DialogHeader>

        {(invoice.isLoading || invoice.isFetching) && (
          <Button disabled variant="ghost">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting invoice data
          </Button>
        )}

        {invoice.data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Selected Invoice Details
                {invoice.data.settled ? (
                  <Badge variant="secondary" className="bg-green-300">
                    SETTLED
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-300">
                    NOT SETTLED
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                INVOICE NO : {invoice.data.invoiceId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Price : {invoice.data.totalPrice}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p>Settled Amount : {invoice.data.settledAmount || "N/A"}</p>
              <p className="text-red-600">
                Remaining :{" "}
                {(invoice.data.settledAmount &&
                  invoice.data.totalPrice &&
                  invoice.data.totalPrice - invoice.data.settledAmount) ||
                  "N/A"}
              </p>
            </CardFooter>
          </Card>
        )}

        <Form {...form}>
          <form
            id="addTransactionForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 grid-rows-2 gap-4"
          >
            <div className="col-span-1 row-span-1 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice No</FormLabel>
                    <FormControl>
                      <Select
                        options={invoiceOptions}
                        placeholder="Select"
                        className=" border-b-2 rounded-md"
                        onChange={(option: any) => {
                          if (option) {
                            form.setValue("invoiceNo", option?.value);
                          }
                        }}
                        value={form.getValues().invoiceNo}
                        isSearchable
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="border-b-2"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 row-span-1 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <Select
                        options={transactionTypeData}
                        placeholder="Select"
                        className=" border-b-2 rounded-md"
                        onChange={(option) => {
                          if (option) {
                            form.setValue("transactionType", option?.value);
                          }
                        }}
                        defaultValue={transactionTypeData.find(
                          (c) => c.value == "INVOICE",
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPartial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Partial</FormLabel>
                    <FormControl>
                      <Select
                        options={yesNo}
                        placeholder="Select"
                        className=" border-b-2 rounded-md"
                        onChange={(option) => {
                          if (option) {
                            form.setValue("isPartial", option?.value);
                          }
                        }}
                        defaultValue={yesNo.find((c) => c.value === "NO")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 row-span-1">
              <FormField
                control={form.control}
                name="chequeNo"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Cheque No</FormLabel>
                    <FormControl>
                      <Input {...field} className=" border-b-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className=" border-b-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button onClick={resetForm} className="w-36" variant={"outline"}>
            Reset
          </Button>
          {createCreditorMutation.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" form="addTransactionForm" className="w-36">
              Add Transaction
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
