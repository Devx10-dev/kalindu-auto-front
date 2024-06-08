import {
  ChassisNo,
  VehicleBrand,
  VehicleModel,
  VehicleModelGridProps,
  VehicleModelResponseData,
  VehicleType,
} from "@/types/sparePartInventory/vehicleTypes";
import capitalize from "@/utils/capitalize";
import truncate from "@/utils/truncate";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import Loading from "../../Loading";
import IconButton from "../../button/IconButton";
import EditIcon from "../../icon/EditIcon";
import SparePartIcon from "../../icon/SparePartIcon";
import { MOBILE_SCREEN_WIDTH } from "../../sidebar/Sidebar";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { toast } from "../../ui/use-toast";
import { useNavigate } from "react-router-dom";

const SPARE_PART_PAGE = "/dashboard/vehicle/part";

export default function VehicleModelsGrid({
  setShow,
  vehicleService,
  setVehicle,
}: VehicleModelGridProps) {
  const navigate = useNavigate();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedChassisNo, setSelectedChassisNo] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    function checkScreenWidth() {
      setIsMobileView(window.innerWidth < MOBILE_SCREEN_WIDTH);
    }

    // Initial check
    checkScreenWidth();

    // Listen for screen resize events
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []); // Only run this effect once on component mount

  const { data: vehicleTypes } = useQuery<VehicleType[]>({
    queryKey: ["vehicleTypes"],
    queryFn: () => vehicleService.fetchVehicleTypes(),
    retry: 2,
  });

  const { data: vehicleBrands } = useQuery<VehicleBrand[]>({
    queryKey: ["vehicleBrands"],
    queryFn: () => vehicleService.fetchVehicleBrands(),
    retry: 2,
  });

  const { data: vehicleChassisNos } = useQuery<ChassisNo[]>({
    queryKey: ["vehicleChassisNos"],
    queryFn: () => vehicleService.fetchVehicleChassisNos(),
    retry: 2,
  });

  const {
    isLoading,
    data: vehicleModels,
    error,
    refetch,
  } = useQuery<VehicleModelResponseData>({
    queryKey: ["vehicleModels"],
    queryFn: () =>
      vehicleService.fetchFilteredVehicleModels(
        pageNo,
        pageSize,
        selectedType,
        selectedBrand,
        selectedChassisNo,
      ),
    retry: 2,
  });

  const [viewVehicleModels, setViewVehicleModels] = useState<VehicleModel[]>(
    vehicleModels?.vehicleModels ?? [],
  );

  useEffect(() => {
    setViewVehicleModels(vehicleModels?.vehicleModels ?? []);
  }, [vehicleModels]);

  const refetchModels = () => {
    refetch();
  };

  if (error) {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  }

  function globalSearch() {
    if (vehicleModels) {
      if (searchQuery.length === 0) {
        setViewVehicleModels(vehicleModels.vehicleModels);
        return;
      }

      const results: VehicleModel[] = [];
      for (const row of vehicleModels.vehicleModels) {
        for (const key in row) {
          if (
            Object.prototype.hasOwnProperty.call(row, key as keyof VehicleModel)
          ) {
            const value = row[key as keyof VehicleModel];
            if (
              value
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            ) {
              results.push(row);
              break;
            }
          }
        }
      }
      setViewVehicleModels(results);
    }
  }

  useEffect(() => {
    globalSearch();
  }, [searchQuery]);

  const handleEditClick = (vehicle: VehicleModel) => {
    setVehicle(vehicle);
    setShow(true);
  };

  const handleViewClick = (chassiNo: string) => {
    navigate(SPARE_PART_PAGE, { state: { data: chassiNo } });
  };

  return (
    <Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div
            className="d-flex gap-3 mb-4 p-4"
            style={{
              borderRadius: "5px",
              boxShadow:
                "rgba(255, 255, 255, 0.1) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.20) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <Input
              style={{ flex: 4 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search ..."
            />
            <div
              style={{ display: `${isMobileView ? "none" : "flex"}` }}
              className="gap-2"
            >
              <div style={{ flex: 2 }}>
                <Select
                  onValueChange={(value) => setSelectedType(value)}
                  value={selectedType ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes !== undefined &&
                      [{ id: -1, type: "All" }, ...vehicleTypes]?.map(
                        (type) => (
                          <SelectItem key={type.id} value={type.type}>
                            {capitalize(type.type)}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div style={{ flex: 2 }}>
                <Select
                  onValueChange={(value) => setSelectedBrand(value)}
                  value={selectedBrand ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleBrands !== undefined &&
                      [{ id: -1, brand: "All" }, ...vehicleBrands]?.map(
                        (brand) => (
                          <SelectItem key={brand.id} value={brand.brand}>
                            {capitalize(brand.brand)}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div style={{ flex: 2 }}>
                <Select
                  onValueChange={(value) => setSelectedChassisNo(value)}
                  value={selectedChassisNo ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Chassis No" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleChassisNos !== undefined &&
                      [{ id: -1, chassisNo: "All" }, ...vehicleChassisNos]?.map(
                        (chassisNo) => (
                          <SelectItem
                            key={chassisNo.id}
                            value={chassisNo.chassisNo}
                          >
                            {chassisNo.chassisNo}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="gap-2 flex-2">
              <Button variant={"default"} onClick={refetchModels}>
                Filter
              </Button>
            </div>
          </div>
          <Table className="border rounded-md text-md mb-5 table-responsive">
            <TableCaption>Vehicle Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Vehicle Brand</TableHead>
                <TableHead>Chassis No</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewVehicleModels &&
                viewVehicleModels.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {capitalize(vehicle.model)}
                    </TableCell>
                    <TableCell>{capitalize(vehicle.vehicleType)}</TableCell>
                    <TableCell>{capitalize(vehicle.vehicleBrand)}</TableCell>
                    <TableCell>{vehicle.chassisNo}</TableCell>
                    <TableCell>
                      {truncate(vehicle.description ?? "", 30) ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-center">
                        <IconButton
                          icon={<EditIcon height="20" width="20" />}
                          tooltipMsg="Edit Vehicle"
                          handleOnClick={() => handleEditClick(vehicle)}
                        />
                        <IconButton
                          icon={<SparePartIcon height="20" width="20" />}
                          handleOnClick={() =>
                            handleViewClick(vehicle.chassisNo)
                          }
                          tooltipMsg="View Spare parts"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}
    </Fragment>
  );
}
