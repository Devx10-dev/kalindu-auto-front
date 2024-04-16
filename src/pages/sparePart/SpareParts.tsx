import VehicleForm from "@/components/form/sparePart/VehicleForm";
import SparePartIcon from "@/components/icon/SparePartIcon";
import { FormModal } from "@/components/modal/FormModal";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

function SpareParts() {
  const [show, setShow] = useState(false);

  return (
    <div className="mr-5 ml-2">
      <CardHeader>
        <CardTitle
          className="text-color"
          icon={<SparePartIcon height="30" width="28" color="#162a3b" />}
        >
          Spare Parts
        </CardTitle>
        <CardDescription>Manage all spare parts.</CardDescription>
      </CardHeader>
      <CardContent style={{ width: "98%" }}>
        <div className="mb-3">
          <Button className="gap-1" onClick={() => setShow(true)}>
            <PlusIcon height="24" width="24" color="#fff" />
            Spare Part
          </Button>
        </div>
        <DataTable />
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

export default SpareParts;
