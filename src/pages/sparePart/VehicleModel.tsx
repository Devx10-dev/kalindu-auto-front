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
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import { VehicleModel as VehicleModelType } from "@/validation/schema/SparePart/vehicleModelSchema";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";

export default function VehicleModel() {
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [formData, setFormData] = useState<VehicleModelType>();
  const [show, setShow] = useState(false);

  const vehicleService = new VehicleService(axiosPrivate);

  const {
    isLoading,
    data: vehicleModels,
    error,
  } = useQuery({
    queryKey: ["vehicleModels"],
    queryFn: () => vehicleService.fetchVehicleModels(pageNo, pageSize),
  });

  if (error) {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  }

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
              vehicleModels={vehicleModels ? vehicleModels.vehicleModels : []}
            />
          </CardContent>
          <FormModal
            title="Add new vehicle"
            titleDescription="Add new vehicle details to the system"
            show={show}
            onClose={() => setShow(false)}
            component={
              <VehicleForm
                formData={formData}
                service={vehicleService}
                onClose={() => setShow(false)}
              />
            }
          />
        </div>
      )}
    </Fragment>
  );
}
