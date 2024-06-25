import PageHeader from "@/components/card/PageHeader";
import CashAndCoinIcon from "@/components/icon/CashAndCoinIcon";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { ChequeService } from "@/service/cheque/ChequeService";
import { PlusIcon } from "lucide-react";
import { Fragment, useState } from "react";
import ChequesGrid from "./components/grid/ChequesGrid";
import { FormModal } from "@/components/modal/FormModal";
import ChequeForm from "./components/form/ChequeForm";
import CreditorAPI from "../creditors/api/CreditorAPI";
import { useQuery } from "@tanstack/react-query";

function ChequeManagement() {
  const axiosPrivate = useAxiosPrivate();
  const chequeService = new ChequeService(axiosPrivate);
  const creditorService = new CreditorAPI(axiosPrivate);

  const [show, setShow] = useState(false);

  const { data: creditors, error } = useQuery({
    queryKey: ["creditors"],
    queryFn: () => creditorService.fetchAllCreditors(),
    retry: 2,
  });

  return (
    <Fragment>
      <div className="mr-2 ml-2">
        <CardHeader>
          <PageHeader
            title="Cheque Management"
            description="Manage all cheques of creditors."
            icon={<CashAndCoinIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent style={{ width: "98%" }}>
          <div className="mb-3">
            <Button className="gap-1" onClick={() => setShow(true)}>
              <PlusIcon height="24" width="24" color="#fff" />
              Cheque
            </Button>
          </div>
          <ChequesGrid chequeService={chequeService} creditors={creditors} />
        </CardContent>
        <FormModal
          title="Add new Spare Part"
          titleDescription="Add new spare part details to the system"
          show={show}
          onClose={() => setShow(false)}
          component={
            <ChequeForm
              creditors={creditors}
              onClose={() => setShow(false)}
              chequeService={chequeService}
              creditorService={creditorService}
            />
          }
        />
      </div>
    </Fragment>
  );
}

export default ChequeManagement;
