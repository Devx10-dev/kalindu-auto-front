import Loading from "@/components/Loading";
import VehicleForm from "@/components/form/sparePart/VehicleForm";
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
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { fetchVehicleModels } from "@/service/sparePartInventory/vehicleServices";
import { Fragment, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

function VehicleModel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const [show, setShow] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: vehicleModelResponse,
  } = useQuery("vehicle models", () => fetchVehicleModels(axiosPrivate));

  useEffect(() => {
    console.log(error);
    if (error) {
      toast({
        title: "Scheduled: Catch up ",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    }
  }, [error, toast]);

  return (
    <Fragment>
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
    </Fragment>
  );
}

export default VehicleModel;
