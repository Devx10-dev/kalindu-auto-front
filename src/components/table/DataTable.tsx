import { Option } from "@/types/component/propTypes";
import { VehicleModel } from "@/types/sparePartInventory/vehicleTypes";
import capitalize from "@/utils/capitalize";
import truncate from "@/utils/truncate";
import { Fragment } from "react/jsx-runtime";
import IconButton from "../button/IconButton";
import FormSelect from "../formElements/FormSelect";
import EditIcon from "../icon/EditIcon";
import SparePartIcon from "../icon/SparePartIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export default function DataTable({
  vehicleModels,
  vehicleService,
}: {
  vehicleModels: VehicleModel[] | undefined;
  vehicleService: VehicleService;
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const { data: vehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => vehicleService.fetchVehicleTypes(),
  });

  const { data: vehicleBrands } = useQuery({
    queryKey: ["vehicleBrands"],
    queryFn: () => vehicleService.fetchVehicleBrands(),
  });

  const resetFilter = () => {
    setSelectedBrand(null);
    setSelectedType(null);
  };

  console.log(selectedType, selectedBrand);

  return (
    <Fragment>
      <div className="d-flex gap-3 mb-4">
        <Input type="text" placeholder="Search ..." />
        <Select
          onValueChange={(value) => setSelectedType(value)}
          value={selectedType ?? undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes?.map((type) => (
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
            {vehicleBrands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.brand}>
                {capitalize(brand.brand)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant={"outline"} onClick={resetFilter}>
          Reset
        </Button>
        <Button variant={"default"}>Filter</Button>
      </div>
      <Table className="border rounded-md text-md mb-5 table-responsive">
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
                  {truncate(vehicle.description ?? "", 50) ?? "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <IconButton
                      icon={<EditIcon height="20" width="20" />}
                      tooltipMsg="Edit Vehicle"
                      handleOnClick={() => console.log("hi")}
                    />
                    <IconButton
                      icon={<SparePartIcon height="20" width="20" />}
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
