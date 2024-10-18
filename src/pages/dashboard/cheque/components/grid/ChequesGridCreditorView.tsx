import SkeletonGrid from "@/components/loader/SkeletonGrid";
import GridModal from "@/components/modal/GridModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ChequeService } from "@/service/cheque/ChequeService";
import { Cheque, ChequeResponseData } from "@/types/cheque/chequeTypes";
import { Creditor } from "@/types/creditor/creditorTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  CheckCheck,
  Eye,
  Filter,
  GalleryHorizontalEnd,
  GalleryVerticalEnd,
  View,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { SettlementModal } from "../modal/SettlementModal";
import CreditInvoiceGrid from "./CreditInvoiceGrid";
import { convertSnakeCaseToNormalCase, truncate } from "@/utils/string";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableBodySkeleton } from "@/pages/dashboard/invoice/view-invoices/components/TableSkeleton";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import dateArrayToString from "@/utils/dateArrayToString";
import { currencyAmountString } from "@/utils/analyticsUtils";
import TablePagination from "@/components/TablePagination";
import NoInvoices from "@/pages/dashboard/creditors/components/NoInvoices";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

function priceRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-md font-bold">
          {/* remove Rs. from begininh */}
          <span>{currency.slice(4)}</span>
          <span className="text-xs font-bold color-muted-foreground">
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}

function ChequesGridCreditorView({
  chequeService,
  creditorId,
}: {
  chequeService: ChequeService;
  creditorId: number;
}) {
  const queryClient = useQueryClient();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  // const [creditorId, setCreditorId] = useState(0);

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedChequeId, setSelectedChequeId] = useState(0);
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);

  const [gridModalShow, setGridModalShow] = useState(false);
  const [gridModalTitle, setGridModalTitle] = useState("");
  const [gridModalDescription, setGridModalDescription] = useState("");

  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [statusList, setStatusList] = useState<
    { label: string; value: string }[]
  >([
    { label: "Settled", value: "SETTLED" },
    { label: "Redeemed", value: "REDEEMED" },
    { label: "Rejected", value: "REJECTED" },
  ]);

  const {
    isLoading,
    data: cheques,
    refetch,
  } = useQuery<ChequeResponseData>({
    queryKey: ["cheques", pageNo, pageSize, creditorId],
    queryFn: () => chequeService.fetchCheques(pageNo, pageSize, creditorId),
    retry: 2,
  });

  const settleChequeMutation = useMutation({
    mutationFn: () => chequeService.settleCheque(selectedChequeId),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully settled cheque.",
      });

      setShow(false);
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Cheque settlement is failed",
        description: data.message,
        duration: 3000,
      });

      setShow(false);
    },
  });

  const rejectChequeMutation = useMutation({
    mutationFn: () => chequeService.rejectCheque(selectedChequeId),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully rejected cheque.",
      });

      setShow(false);
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Cheque rejection is failed",
        description: data.message,
        duration: 3000,
      });

      setShow(false);
    },
  });

  const settleCheque = async () => {
    if (selectedChequeId !== 0) await settleChequeMutation.mutateAsync();
  };

  const rejectCheque = async () => {
    if (selectedChequeId !== 0) await rejectChequeMutation.mutateAsync();
  };

  const onClose = () => {
    setSelectedChequeId(0);
    setSelectedCheque(null);
    setTitle("");
    setShow(false);
  };

  const onGridModalClose = () => {
    setSelectedChequeId(0);
    setSelectedCheque(null);
    setGridModalTitle("");
    setGridModalDescription("");
    setGridModalShow(false);
  };

  const handleActionBtnClick = (cheque: Cheque) => {
    setTitle(`Are you sure to handle this ${cheque.chequeNo} status ?`);
    setSelectedChequeId(cheque.id);
    setShow(true);
  };

  const handleViewBtnClick = (cheque: Cheque) => {
    setGridModalTitle(`Credit invoices of ${cheque.chequeNo}`);
    setGridModalDescription(
      `Credit invoices those settled by ${cheque.chequeNo}`,
    );
    setSelectedCheque(cheque);
    setGridModalShow(true);
  };

  useEffect(() => {
    if (cheques) {
      setTotalPages(cheques.totalPages);
    }
  }, [cheques]);

  return (
    <Fragment>
      <>
        <div
          className="mb-4 pt-2 pb-2 pr-2 w-full"
          style={{
            borderRadius: "5px",
          }}
        >
          <div className="d-flex gap-4">
            <Input
              type="text"
              placeholder="Search for Cheques"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <MultiSelect
              options={statusList}
              onValueChange={setSelectedOption}
              defaultValue={selectedOption}
              placeholder="Select Status"
              variant="secondary"
              animation={0}
              maxCount={1}
              modalPopover={true}
              badgeInlineClose={false}
              className="w-full"
            />
          </div>
        </div>

        <Table className="border rounded-md text-md mb-5 table-responsive">
          <TableCaption>
            <TablePagination
              pageNo={pageNo + 1}
              totalPages={totalPages}
              onPageChange={(page) => {
                setPageNo(page - 1);
              }}
            />
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Cheque No</TableHead>
              <TableHead style={{ textAlign: "end" }}>Amount</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Added on</TableHead>
              <TableHead style={{ textAlign: "center" }}>Status</TableHead>
              <TableHead style={{ textAlign: "center" }}>Action</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBodySkeleton cols={6} rows={10} />
          ) : (
            <TableBody>
              {cheques === undefined || cheques.cheques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <NoInvoices message="No cheques Available for the selected criteria." />
                  </TableCell>
                </TableRow>
              ) : (
                cheques.cheques.map((cheque) => (
                  <TableRow key={cheque.id}>
                    <TableCell className="font-medium">
                      {truncate(cheque.chequeNo, 20)}
                    </TableCell>
                    <TableCell align="right">
                      {priceRender(
                        "currencyAmount",
                        currencyAmountString(cheque.amount),
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {priceRender(
                        "currencyAmount",
                        currencyAmountString(
                          cheque.availableAmount ? cheque.availableAmount : 0,
                        ),
                      )}
                    </TableCell>
                    <TableCell>{dateArrayToString(cheque.dateTime)}</TableCell>
                    <TableCell align="center">
                      {
                        <p
                          className="pl-2 pr-2"
                          style={{
                            background:
                              cheque.status === "REJECTED"
                                ? "#dc3545"
                                : cheque.status === "SETTLED"
                                  ? "#198754"
                                  : "#ffc107",
                            color: "#fff",
                            borderRadius: 5,
                            maxWidth: "max-content",
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          {convertSnakeCaseToNormalCase(cheque.status)}
                        </p>
                      }
                    </TableCell>
                    <TableCell align="center">
                      {
                        <>
                          <Button
                            className="mr-2"
                            variant="outline"
                            onClick={() => handleActionBtnClick(cheque)}
                            disabled={cheque.status !== "PENDING"}
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className=""
                                  variant="outline"
                                  onClick={() => handleViewBtnClick(cheque)}
                                  disabled={
                                    cheque.status === "PENDING" ||
                                    cheque.status === "REJECTED"
                                  }
                                >
                                  <OpenInNewWindowIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{"View settled invoices"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
        <SettlementModal
          onClose={onClose}
          show={show}
          onReject={rejectCheque}
          onSettle={settleCheque}
          title={title}
        />
        <GridModal
          onClose={onGridModalClose}
          show={gridModalShow}
          title={gridModalTitle}
          titleDescription={gridModalDescription}
          component={
            <CreditInvoiceGrid
              cheque={selectedCheque}
              onClose={onGridModalClose}
            />
          }
        />
      </>
    </Fragment>
  );
}

export default ChequesGridCreditorView;
