import PageHeader from "@/components/card/PageHeader";
import SparePartForm from "@/components/form/sparePart/SparePartForm";
import PlusIcon from "@/components/icon/PlusIcon";
import SparePartIcon from "@/components/icon/SparePartIcon";
import { FormModal } from "@/components/modal/FormModal";
import SparePartGrid from "@/components/table/sparePartInventory/SparePartGrid";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import { SparePartItem } from "@/types/sparePartInventory/sparePartTypes";
import { Fragment, useState } from "react";

export default function VehicleSparePart() {
  const axiosPrivate = useAxiosPrivate();

  const [show, setShow] = useState(false);
  const [sparePart, setSparePart] = useState<SparePartItem | null>(null);

  const sparePartService = new SparePartService(axiosPrivate);
  const vehicleService = new VehicleService(axiosPrivate);

  return (
    <Fragment>
      <div className="mr-2 ml-2">
        <CardHeader>
          <PageHeader
            title="Spare Parts"
            description="Manage all spare part details."
            icon={<SparePartIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent style={{ width: "98%" }}>
          <div className="mb-3">
            <Button className="gap-1" onClick={() => setShow(true)}>
              <PlusIcon height="24" width="24" color="#fff" />
              Spare Part
            </Button>
          </div>
          <SparePartGrid
            setShow={setShow}
            setSparePart={setSparePart}
            sparePartService={sparePartService}
            vehicleService={vehicleService}
          />
        </CardContent>
        <FormModal
          title={
            sparePart === null ? "Add new Spare Part" : "Update Spare Part"
          }
          titleDescription={`${sparePart === null ? "Add new" : "Update"} spare part details ${sparePart === null ? "to" : "in"} the system`}
          show={show}
          onClose={() => setShow(false)}
          component={
            <SparePartForm
              onClose={() => setShow(false)}
              setSparePart={setSparePart}
              sparePart={sparePart}
              sparePartservice={sparePartService}
              vehicleService={vehicleService}
            />
          }
        />
      </div>
    </Fragment>
  );
}
