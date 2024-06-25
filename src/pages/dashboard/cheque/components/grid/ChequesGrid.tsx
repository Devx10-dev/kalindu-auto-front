import Loading from "@/components/Loading";
import IconButton from "@/components/button/IconButton";
import PatchVerifyIcon from "@/components/icon/PatchVerifyIcon";
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
import { Fragment, useState } from "react";
import { SettlementModal } from "../modal/SettlementModal";
import SkeletonGrid from "@/components/loader/SkeletonGrid";
import GridModal from "@/components/modal/GridModal";
import CreditInvoiceGrid from "./CreditInvoiceGrid";
import ListCheckIcon from "@/components/icon/ListCheckIcon";
import VerifyIcon from "@/components/icon/VerifyIcon";

function ChequesGrid({
  creditors,
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
    setTitle("");
    setShow(false);
  };

  const onGridModalClose = () => {
    setSelectedChequeId(0);
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
    setSelectedChequeId(cheque.id);
    setGridModalShow(true);
  };

  return (
    <Fragment>
      <>
        <div
          className="mb-4 p-4"
          style={{
            borderRadius: "5px",
            boxShadow:
              "rgba(255, 255, 255, 0.1) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.20) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
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

            <Button variant={"default"} onClick={refetchCheques}>
              Filter
            </Button>
          </div>
        </div>
        {isLoading ? (
          <SkeletonGrid noOfColumns={6} noOfItems={10} />
        ) : (
          <Table className="border rounded-md text-md mb-5 table-responsive">
            <TableCaption>Cheque Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Cheque No</TableHead>
                <TableHead>Creditor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cheques.cheques !== undefined &&
                cheques.cheques.map((cheque) => (
                  <TableRow key={cheque.id}>
                    <TableCell className="font-medium">
                      {cheque.chequeNo}
                    </TableCell>
                    <TableCell>{cheque?.creditorName ?? "-"}</TableCell>
                    <TableCell>{cheque.amount}</TableCell>
                    <TableCell>{`${cheque.dateTime[0]}-${cheque.dateTime[1]}-${cheque.dateTime[2]} ${cheque.dateTime[3]}:${cheque.dateTime[4]}:${cheque.dateTime[5]}`}</TableCell>
                    <TableCell>{cheque.status}</TableCell>
                    <TableCell align="center">
                      {
                        <div className="d-flex gap-2">
                          <Button
                            onClick={() => handleActionBtnClick(cheque)}
                            disabled={cheque.status !== "PENDING"}
                          >
                            <div className="gap-2 d-flex">
                              <VerifyIcon height="20" width="20" color="#fff" />
                              Settle Cheque
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleViewBtnClick(cheque)}
                            disabled={cheque.status !== "SETTLED"}
                          >
                            <div className="gap-2 d-flex">
                              <ListCheckIcon
                                height="20"
                                width="20"
                                color="#000"
                              />
                              View Credit Invoices
                            </div>
                          </Button>
                        </div>
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
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
              chequeId={selectedChequeId}
              chequeService={chequeService}
              onClose={onGridModalClose}
            />
          }
        />
      </>
    </Fragment>
  );
}

export default ChequesGrid;
