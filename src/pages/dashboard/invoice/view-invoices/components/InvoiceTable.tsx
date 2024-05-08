import { Option } from "@/types/component/propTypes";
import { VehicleModel } from "@/types/sparePartInventory/vehicleTypes";
import capitalize from "@/utils/capitalize";
import truncate from "@/utils/truncate";
import { Fragment } from "react/jsx-runtime";
import IconButton from "@/components/button/IconButton";
import FormSelect from "@/components/formElements/FormSelect";
import EditIcon from "@/components/icon/EditIcon";
import SparePartIcon from "@/components/icon/SparePartIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import { Invoice } from "@/types/Invoices/invoiceTypes";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export default function InvoiceTable({
  invoices,
}: {
  invoices: Invoice[] | undefined;
//   vehicleService: VehicleService;
}) {
//   const [selectedType, setSelectedType] = useState<string | null>(null);
//   const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

//   const { data: vehicleTypes } = useQuery({
//     queryKey: ["vehicleTypes"],
//     queryFn: () => vehicleService.fetchVehicleTypes(),
//   });

//   const { data: vehicleBrands } = useQuery({
//     queryKey: ["vehicleBrands"],
//     queryFn: () => vehicleService.fetchVehicleBrands(),
//   });


//   const resetFilter = () => {
//     setSelectedBrand(null);
//     setSelectedType(null);
//   };

//   console.log(selectedType, selectedBrand);

// export type Invoice = {
//     id?: number;
//     invoiceNo?: string;
//     customerName?: string;
//     customerId?: number;
//     invoiceDate?: string;
//     dueDate?: string;
//     totalAmount?: number;
//     status?: string;
// };


  return (
    <Fragment>
      <div className="d-flex gap-3 mb-4">
        <Input type="text" placeholder="Search for Invoices" />
        <DateRangePicker />
        {/* <Select
          onValueChange={(value) => setSelectedType(value)}
          value={selectedType ?? undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes !== undefined && vehicleTypes?.map((type) => (
              <SelectItem key={type.id} value={type.type}>
                {capitalize(type.type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setSelectedBrand(value)}
          value={selectedBrand ?? undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Vehicle Brand" />
          </SelectTrigger>
          <SelectContent>
            {vehicleBrands !== undefined && vehicleBrands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.brand}>
                {capitalize(brand.brand)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Button variant={"outline"} >
          Reset
        </Button>
        <Button variant={"default"}>Filter</Button>
      </div>
      <Table className="border rounded-md text-md mb-5 table-responsive">
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Invoice Date</TableHead>
            {/* <TableHead>Due Date</TableHead> */}
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices &&
            invoices.map((invoice) => (
            //   <TableRow key={vehicle.id}>
            //     <TableCell className="font-medium">
            //       {capitalize(vehicle.model)}
            //     </TableCell>
            //     <TableCell>{capitalize(vehicle.vehicleType)}</TableCell>
            //     <TableCell>{capitalize(vehicle.vehicleBrand)}</TableCell>
            //     <TableCell>
            //       {truncate(vehicle.description ?? "", 50) ?? "-"}
            //     </TableCell>
            <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNo}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.invoiceDate}</TableCell>
                {/* <TableCell>{invoice.dueDate}</TableCell> */}
                <TableCell>Rs. {invoice.totalAmount}</TableCell>
                <TableCell>
                    {
                        invoice.status === "paid" ? 
                    // First letter capitalized
                        <Badge variant="secondary" >{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Badge> :
                        <Badge variant="destructive">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Badge>
                    }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <Button variant="outline" className="mr-2">
                      <OpenInNewWindowIcon className="h-5 w-5" /> View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}
