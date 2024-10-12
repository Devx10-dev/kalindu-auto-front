import AmountCard from "@/components/card/AmountCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Creditor } from "@/types/creditor/creditorTypes";
import { ArrowLeftRight, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { RegisterForm } from "./CreditorForm";

const CreditorsTable = (props: { creditorData?: Creditor[] }) => {
  return (
    <>
      <div className="overflow-x-auto ">
        <Table className="border rounded-md text-md mb-5 min-w-full table-auto mt-4">
          <TableCaption>Creditor Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Contact No</TableHead>
              <TableHead style={{ textAlign: "end" }}>Due Balance</TableHead>
              <TableHead style={{ textAlign: "end" }}>Cheque Balance</TableHead>
              <TableHead style={{ textAlign: "end" }}>Credit Limit</TableHead>
              <TableHead style={{ textAlign: "center" }}>Is Overdue</TableHead>
              <TableHead style={{ textAlign: "center" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.creditorData?.map((creditor) => (
              <TableRow
                key={creditor.creditorID}
                style={{ background: `${creditor.isExpired && "#fef9f0"}` }}
              >
                <TableCell className="font-medium">
                  {creditor.shopName}
                </TableCell>
                <TableCell className="font-medium">
                  {creditor?.contactPersonName}
                </TableCell>
                <TableCell>{creditor.primaryContact}</TableCell>
                <TableCell align="right">
                  <AmountCard
                    amount={parseFloat(creditor.totalDue)}
                    color={`${parseFloat(creditor.totalDue) <= 0 ? "#B4E380" : "#FFAAAA"}`}
                  />
                </TableCell>
                <TableCell align="right">
                  <AmountCard
                    amount={parseFloat(creditor.chequeBalance)}
                    color="#B4E380"
                  />
                </TableCell>
                <TableCell align="right">
                  {creditor.creditLimit ? creditor.creditLimit : "-"}
                </TableCell>
                <TableCell align="center">
                  <p
                    className="p-badge"
                    style={{
                      background: creditor.isExpired ? "#dc3545" : "#198754",
                    }}
                  >
                    {creditor.isExpired ? "Yes" : "No"}
                  </p>
                </TableCell>
                <TableCell className="text-right flex">
                  <Link
                    to={`/dashboard/creditors/manage/${creditor.creditorID}`}
                  >
                    <Button className="mr-5" variant="outline">
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      More
                    </Button>
                  </Link>
                  {/* {creditor.isExpired && (
                    <ViewExpiredInvoices
                      invoiceList={creditor.expiredInvoiceList}
                    />
                  )} */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="w-18">
                        <Pencil className="mr-2 h-3 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px]">
                      <DialogHeader>
                        <DialogTitle>Edit Creditor</DialogTitle>
                        <DialogDescription>
                          Edit the necessary creditor details and hit save
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <RegisterForm isEditMode={true} creditor={creditor} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CreditorsTable;
