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
import { ViewExpiredInvoices } from "./ViewExpiredInvoices";

const CreditorsTable = (props: { creditorData?: Creditor[] }) => {
  return (
    <>
      <div className="flex flex-col justify-end mt-10">
        <Table className="border rounded-md text-md mb-5">
          <TableCaption>Creditor Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Creditor Name</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Due Balance</TableHead>
              <TableHead>Cheque Balance</TableHead>
              <TableHead>Credit Limit (LKR)</TableHead>
              <TableHead>Expired Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.creditorData?.map((creditor) => (
              <TableRow
                key={creditor.creditorID}
                className={`${creditor.isExpired ? "bg-orange-100" : null}`}
              >
                <TableCell className="font-medium">
                  {creditor.shopName}
                </TableCell>
                <TableCell>{creditor.primaryContact}</TableCell>
                <TableCell align="right">
                  {creditor.totalDue ? creditor.totalDue : 0}
                </TableCell>
                <TableCell align="right">
                  {creditor.totalDue ? creditor.chequeBalance : 0}
                </TableCell>
                <TableCell align="right">
                  {creditor.creditLimit ? creditor.creditLimit : "-"}
                </TableCell>

                <TableCell align="center">
                  {creditor.isExpired ? "Yes" : "No"}
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
