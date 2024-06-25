import {
  SparePartGridProps,
  SparePartItem,
  SparePartsResponseData,
} from "@/types/sparePartInventory/sparePartTypes";
import { ChassisNo } from "@/types/sparePartInventory/vehicleTypes";
import capitalize, { truncate } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import IconButton from "../../button/IconButton";
import EditIcon from "../../icon/EditIcon";
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
import SkeletonGrid from "@/components/loader/SkeletonGrid";

export default function SparePartGrid({
  setShow,
  vehicleService,
  sparePartService,
  setSparePart,
}: SparePartGridProps) {
  const { state } = useLocation();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedChassisNo, setSelectedChassisNo] = useState<string | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicleChassisNos } = useQuery<ChassisNo[]>({
    queryKey: ["vehicleChassisNos"],
    queryFn: () => vehicleService.fetchVehicleChassisNos(),
  });

  const {
    isLoading,
    data: spareParts,
    error,
    refetch,
  } = useQuery<SparePartsResponseData>({
    queryKey: ["spareParts"],
    queryFn: () =>
      sparePartService.fetchFilteredSpaerParts(
        pageNo,
        pageSize,
        selectedChassisNo
      ),
    retry: 2,
  });

  useEffect(() => {
    if (state && state.data) setSelectedChassisNo(state.data);
  }, [state]);

  const [viewSpareParts, setViewSpareParts] = useState<SparePartItem[]>(
    spareParts?.spareParts ?? []
  );

  useEffect(() => {
    setViewSpareParts(spareParts?.spareParts ?? []);
  }, [spareParts]);

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
    if (spareParts) {
      if (searchQuery.length === 0) {
        setViewSpareParts(spareParts.spareParts);
        return;
      }

      const results: SparePartItem[] = [];
      for (const row of spareParts.spareParts) {
        for (const key in row) {
          if (
            Object.prototype.hasOwnProperty.call(
              row,
              key as keyof SparePartItem
            )
          ) {
            const value = row[key as keyof SparePartItem];
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
      setViewSpareParts(results);
    }
  }

  useEffect(() => {
    globalSearch();
  }, [searchQuery]);

  const handleEditClick = (sparePart: SparePartItem) => {
    setSparePart(sparePart);
    setShow(true);
  };

  return (
    <Fragment>
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
          <div className="gap-2">
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
                          key={Math.random()}
                          value={chassisNo.chassisNo}
                        >
                          {chassisNo.chassisNo}
                        </SelectItem>
                      )
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

        {isLoading ? (
          <SkeletonGrid noOfColumns={6} noOfItems={10} />
        ) : (
          <Table className="border rounded-md text-md mb-5 table-responsive">
            <TableCaption>Spare Part Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Spare Part</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Chassis No</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {viewSpareParts &&
                viewSpareParts.map((sparePart) => (
                  <TableRow key={sparePart.id}>
                    <TableCell className="font-medium">
                      {capitalize(sparePart.partName)}
                    </TableCell>
                    <TableCell>{sparePart.code ?? "-"}</TableCell>
                    <TableCell>{sparePart.chassisNo}</TableCell>
                    <TableCell>{sparePart.quantity}</TableCell>
                    <TableCell>
                      {truncate(sparePart.description ?? "", 30) ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-center">
                        <IconButton
                          icon={<EditIcon height="20" width="20" />}
                          tooltipMsg="Edit Spare Part"
                          handleOnClick={() => handleEditClick(sparePart)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </>
    </Fragment>
  );
}
