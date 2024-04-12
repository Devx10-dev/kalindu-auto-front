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
import { Table, TableCell, TableHead, TableRow } from "../ui/table";
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
      <Card className="p-2 pb-0">
        <Table style={{ minWidth: "800px", overflowX: "scroll" }}>
          <thead>
            <TableRow>
              <TableHead className="fs-18 fw-600 p-2">Vehicle</TableHead>
              <TableHead className="fs-18 fw-600 p-2">Vehicle Type</TableHead>
              <TableHead className="fs-18 fw-600 p-2">Vehicle Brand</TableHead>
              <TableHead className="fs-18 fw-600 p-2">Description</TableHead>
              <TableHead className="fs-18 fw-600 p-2 text-center">
                Actions
              </TableHead>
            </TableRow>
          </thead>

          <tbody>
            {vehicleModels &&
              vehicleModels.map((vehicle, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2">
                    {capitalize(vehicle.model)}
                  </TableCell>
                  <TableCell className="p-2">
                    {capitalize(vehicle.vehicleType)}
                  </TableCell>
                  <TableCell className="p-2">
                    {capitalize(vehicle.vehicleBrand)}
                  </TableCell>
                  <TableCell className="p-2">
                    {truncate(vehicle.description ?? "", 30) ?? "-"}
                  </TableCell>
                  <TableCell className="p-2">
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
          </tbody>
        </Table>

        <Pagination className="justify-end m-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </Fragment>
  );
}
