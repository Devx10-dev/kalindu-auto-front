import { Option } from "@/types/component/propTypes";
import { VehicleModelFormData } from "@/types/sparePartInventory/vehicleTypes";
import capitalize from "@/utils/capitalize";
import { Fragment } from "react/jsx-runtime";
import IconButton from "../button/IconButton";
import FormSelect from "../formElements/FormSelect";
import EditIcon from "../icon/EditIcon";
import SparePartIcon from "../icon/SparePartIcon";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import truncate from "@/utils/truncate";

export default function DataTable({
  vehicleModels,
}: {
  vehicleModels: VehicleModelFormData[] | undefined;
}) {
  const vehicleTypeOptions: Option[] = [];
  const vehicleBrandOptions: Option[] = [];

  console.log(vehicleModels);
  if (vehicleModels)
    vehicleModels.map((vehicle) => {
      vehicleTypeOptions.push({
        label: vehicle.vehicleType,
        value: vehicle.vehicleType,
      });
      vehicleBrandOptions.push({
        label: vehicle.vehicleBrand,
        value: vehicle.vehicleBrand,
      });
    });

  return (
    <Fragment>
      <div className="flex gap-3 mb-4">
        <Input type="text" placeholder="Search ..." />
        <div className="w-max">
          <FormSelect
            options={vehicleTypeOptions}
            placeholder="Select vehicle type"
            selectLabel="Vehicle Types"
          />
        </div>
        <div className="w-max">
          <FormSelect
            options={vehicleBrandOptions}
            placeholder="Select vehicle brand"
            selectLabel="Vehicle Brands"
          />
        </div>

        <Button variant={"secondary"} type="submit">
          Reset
        </Button>
        <Button type="submit">Filter</Button>
      </div>
        <Table className="border rounded-md text-md mb-5">
          <TableCaption>Vehicle Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Vehicle Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleModels &&
              vehicleModels.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    {capitalize(vehicle.model)}
                  </TableCell>
                  <TableCell>{capitalize(vehicle.vehicleType)}</TableCell>
                  <TableCell>{capitalize(vehicle.vehicleBrand)}</TableCell>
                  <TableCell>
                    {truncate(vehicle.description ?? "", 30) ?? "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-center">
                      <IconButton
                        icon={<EditIcon height="24" width="24" />}
                        tooltipMsg="Edit Vehicle"
                        handleOnClick={() => console.log("hi")}
                      />
                      <IconButton
                        icon={<SparePartIcon height="24" width="24" />}
                        handleOnClick={() => console.log("hello")}
                        tooltipMsg="View Spare parts"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
    </Fragment>
  );
}
