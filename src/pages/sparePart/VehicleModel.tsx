import { VehicleForm } from "@/components/form/sparePart/VehicleForm";
import CarIcon from "@/components/icon/CarIcon";
import PlusIcon from "@/components/icon/PlusIcon";
import { FormModal } from "@/components/modal/FormModal";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { fetchVehicleModels } from "@/service/sparePartInventory/vehicleServices";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

function VehicleModel() {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const [show, setShow] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: vehicleModelResponse,
  } = useQuery("vehicle models", () => fetchVehicleModels(axiosPrivate));

  console.log(vehicleModelResponse);
  // const vehicleModels = data;

  return (
    <div className="mr-5 ml-2">
      <CardHeader>
        <CardTitle
          className="text-color"
          icon={<CarIcon height="30" width="28" color="#162a3b" />}
        >
          Vehicles
        </CardTitle>
        <CardDescription>
          Manage all vehicles details with their models, brands, and types.
        </CardDescription>
      </CardHeader>
      <CardContent style={{ width: "98%" }}>
        <div className="mb-3">
          <Button className="gap-1" onClick={() => setShow(true)}>
            <PlusIcon height="24" width="24" color="#fff" />
            Vehicle
          </Button>
        </div>
        <DataTable
          vehicleModels={
            vehicleModelResponse ? vehicleModelResponse.vehicleModels : []
          }
        />
      </CardContent>
      <FormModal
        title="Add new vehicle"
        titleDescription="Add new vehicle details to the system"
        onSubmit={() => console.log("submit")}
        show={show}
        onClose={() => setShow(false)}
        component={<VehicleForm />}
      />
    </div>
  );
}

export default VehicleModel;
