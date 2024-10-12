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
import { Fragment, useState } from "react";
import { SettlementModal } from "../modal/SettlementModal";
import CreditInvoiceGrid from "./CreditInvoiceGrid";

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

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedChequeId, setSelectedChequeId] = useState(0);
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);

  const [gridModalShow, setGridModalShow] = useState(false);
  const [gridModalTitle, setGridModalTitle] = useState("");
  const [gridModalDescription, setGridModalDescription] = useState("");

  const {
    isLoading,
    data: cheques,
    refetch,
  } = useQuery<ChequeResponseData>({
    queryKey: ["cheques"],
    queryFn: () => chequeService.fetchCheques(pageNo, pageSize, creditorId),
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

  return (
    <Fragment>
      <>
        <div
          className="mb-4 pt-2 pb-2 pr-2 w-1/2"
          style={{
            borderRadius: "5px",
          }}
        >
          <div className=" d-flex gap-4">
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
                    <SelectItem key={Math.random()} value={creditor.creditorID}>
                      {creditor.contactPersonName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button variant={"secondary"} onClick={refetchCheques}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        {isLoading ? (
          <SkeletonGrid noOfColumns={6} noOfItems={10} />
        ) : (
          <div className="overflow-x-auto ">
            <Table className="border rounded-md text-md mb-5 min-w-full table-auto">
              <TableCaption>Cheque Details</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Cheque No</TableHead>
                  <TableHead>Creditor</TableHead>
                  <TableHead style={{ textAlign: "end" }}>Amount</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead style={{ textAlign: "center" }}>Status</TableHead>
                  <TableHead style={{ textAlign: "center" }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cheques.cheques !== undefined &&
                  cheques.cheques.map((cheque) => (
                    <TableRow key={cheque.id}>
                      <TableCell className="font-medium">
                        {truncate(cheque.chequeNo, 20)}
                      </TableCell>
                      <TableCell>{cheque?.creditorName ?? "-"}</TableCell>
                      <TableCell align="right">{cheque.amount}</TableCell>
                      <TableCell>{`${cheque.dateTime[0]}-${cheque.dateTime[1]}-${cheque.dateTime[2]} ${cheque.dateTime[3]}:${cheque.dateTime[4]}:${cheque.dateTime[5]}`}</TableCell>
                      <TableCell align="center">
                        {
                          <p
                            className="p-badge"
                            style={{
                              background:
                                cheque.status === "REJECTED"
                                  ? "#dc3545"
                                  : cheque.status === "SETTLED"
                                    ? "#198754"
                                    : "#ffc107",
                            }}
                          >
                            {convertSnakeCaseToNormalCase(cheque.status)}
                          </p>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          <div className="d-flex gap-1">
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
            </Table>
          </div>
        )}
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

export default ChequesGrid;
