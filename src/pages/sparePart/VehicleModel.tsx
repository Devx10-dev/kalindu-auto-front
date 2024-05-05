import PageHeader from "@/components/card/PageHeader";
import VehicleForm from "@/components/form/sparePart/VehicleForm";
import CarIcon from "@/components/icon/CarIcon";
import PlusIcon from "@/components/icon/PlusIcon";
import { FormModal } from "@/components/modal/FormModal";
import VehicleModelsGrid from "@/components/table/VehicleModelsGrid";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import {
  VehicleModel as VehicleModelType
} from "@/types/sparePartInventory/vehicleTypes";
import { Fragment, useState } from "react";

export default function VehicleModel() {
  const axiosPrivate = useAxiosPrivate();

  const [show, setShow] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleModelType | null>(null);

  const vehicleService = new VehicleService(axiosPrivate);

  return (
    <Fragment>
      <div className="mr-2 ml-2">
        <CardHeader>
          <PageHeader
            title="Vehicles"
            description="Manage all vehicles details with their models, brands, and types."
            icon={<CarIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent style={{ width: "98%" }}>
          <div className="mb-3">
            <Button className="gap-1" onClick={() => setShow(true)}>
              <PlusIcon height="24" width="24" color="#fff" />
              Vehicle
            </Button>
          </div>
          <VehicleModelsGrid
            setShow={setShow}
            vehicleService={vehicleService}
            setVehicle={setVehicle}
          />
        </CardContent>
        <FormModal
          title="Add new vehicle"
          titleDescription="Add new vehicle details to the system"
          show={show}
          onClose={() => setShow(false)}
          component={
            <VehicleForm
              service={vehicleService}
              onClose={() => setShow(false)}
              vehicleModel={vehicle}
              setVehicle={setVehicle}
            />
          }
        />
      </div>
    </Fragment>
  );
}
