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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { ChequeService } from "@/service/cheque/ChequeService";
import { Cheque, ChequeResponseData } from "@/types/cheque/chequeTypes";
import { Creditor } from "@/types/creditor/creditorTypes";
import { convertSnakeCaseToNormalCase, truncate } from "@/utils/string";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Filter, GalleryHorizontalEnd } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { SettlementModal } from "../modal/SettlementModal";
import CreditInvoiceGrid from "./CreditInvoiceGrid";
import TablePagination from "@/components/TablePagination";
import dateArrayToString from "@/utils/dateArrayToString";
import { currencyAmountString } from "@/utils/analyticsUtils";
import ChequeStatusBadge from "@/pages/dashboard/invoice/view-invoices/components/ChequeStatusBadge";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import useDebounce from "@/hooks/useDebounce";
import { TableBodySkeleton } from "@/pages/dashboard/creditors/components/TableSkelton";

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

function ChequesGrid({
  creditors = [],
  chequeService,
}: {
  creditors: Creditor[];
  chequeService: ChequeService;
}) {
  const queryClient = useQueryClient();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [creditorId, setCreditorId] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
    { label: "Pending", value: "PENDING" },
    { label: "Settled", value: "SETTLED" },
    { label: "Redeemed", value: "REDEEMED" },
    { label: "Rejected", value: "REJECTED" },
  ]);

  const debouncedSearch = useDebounce(search, 500);

  const {
    isLoading,
    data: cheques,
    refetch,
  } = useQuery<ChequeResponseData>({
    queryKey: ["cheques", pageNo, creditorId, debouncedSearch, selectedOption],
    queryFn: () =>
      chequeService.fetchCheques(
        pageNo,
        pageSize,
        creditorId,
        debouncedSearch,
        selectedOption
      ),
    retry: 2,
  });

  const refetchCheques = () => {
    refetch();
  };

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
      `Credit invoices those settled by ${cheque.chequeNo}`
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
          <div className=" flex gap-4 w-full">
            <Input
              type="text"
              placeholder="Search for Cheques"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full"
            />

            <Select onValueChange={(value) => setCreditorId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Creditor" />
              </SelectTrigger>
              <SelectContent>
                {creditors !== undefined &&
                  [
                    { creditorID: "0", contactPersonName: "All Creditors" },
                    ...creditors,
                  ]?.map((creditor) => (
                    <SelectItem
                      key={Math.random()}
                      value={String(creditor.creditorID)}
                    >
                      {creditor.contactPersonName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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

        <div className="overflow-x-auto ">
          <Table className="border rounded-md text-md mb-5 min-w-full table-auto">
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
                <TableHead>Creditor</TableHead>
                <TableHead style={{ textAlign: "end" }}>Amount</TableHead>
                <TableHead className="text-right" align="right">
                  Available
                </TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead style={{ textAlign: "center" }}>Status</TableHead>
                <TableHead style={{ textAlign: "center" }} className="w-fit">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableBodySkeleton cols={7} rows={10} />
            ) : (
              <TableBody>
                {cheques.cheques !== undefined &&
                  cheques.cheques.map((cheque) => (
                    <TableRow key={cheque.id}>
                      <TableCell className="font-medium">
                        {truncate(cheque.chequeNo, 20)}
                      </TableCell>
                      <TableCell>{cheque?.creditorName ?? "-"}</TableCell>
                      <TableCell align="right">
                        {priceRender(
                          "currencyAmount",
                          currencyAmountString(cheque.amount)
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {cheque?.availableAmount
                          ? priceRender(
                              "currencyAmount",
                              currencyAmountString(cheque.availableAmount)
                            )
                          : priceRender(
                              "currencyAmount",
                              currencyAmountString(0)
                            )}
                      </TableCell>
                      <TableCell>
                        {dateArrayToString(cheque?.dateTime, false, true)}
                      </TableCell>
                      <TableCell align="center">
                        {
                          <ChequeStatusBadge
                            cheque={cheque}
                            redeemStatus={true}
                          />
                        }
                      </TableCell>
                      <TableCell align="center" className="w-fit">
                        {
                          <div className="flex justify-center items-center">
                            <Button
                              className="mr-2 action-button"
                              variant="outline"
                              onClick={() => handleActionBtnClick(cheque)}
                              disabled={cheque.status !== "PENDING"}
                            >
                              <CheckCheck className="mr-2 h-4 w-4" />
                              <span className="button-text">Settle</span>
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    className="action-button"
                                    variant="outline"
                                    onClick={() => handleViewBtnClick(cheque)}
                                    disabled={
                                      cheque.status === "PENDING" ||
                                      cheque.status === "REJECTED"
                                    }
                                  >
                                    <GalleryHorizontalEnd className="mr-2 h-4 w-4" />
                                    <span className="button-text">View</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{"View settled invoices"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </div>

        <SettlementModal
          onClose={onClose}
          show={show}
          onReject={rejectCheque}
          onSettle={settleCheque}
          title={title}
          settleCheckMutation={settleChequeMutation}
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

export default ChequesGrid;
