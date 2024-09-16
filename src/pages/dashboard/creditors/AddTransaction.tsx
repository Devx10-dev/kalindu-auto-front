import PageHeader from "@/components/card/PageHeader";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { ChequeService } from "@/service/cheque/ChequeService";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";
import { Fragment, useState } from "react";
import CreditorAPI from "./api/CreditorAPI";
import TransactionForm from "./components/TransactionForm";

export function AddTransaction() {
  const axiosPrivate = useAxiosPrivate();

  const chequeService = new ChequeService(axiosPrivate);
  const creditorService = new CreditorAPI(axiosPrivate);

  const [show, setShow] = useState(false);

  const { data: creditors, error } = useQuery({
    queryKey: ["allCreditors"],
    queryFn: () => creditorService.fetchAllCreditors(),
    retry: 1,
  });

  return (
    <Fragment>
      <div className="mr-2 ml-2">
        <CardHeader>
          <PageHeader
            title="Add Transaction"
            description="Record a creditor's transaction details"
            icon={<ArrowLeftRight />}
          />
        </CardHeader>
        <CardContent>
          <TransactionForm
            chequeService={chequeService}
            creditorService={creditorService}
            creditors={creditors}
            onClose={() => setShow(false)}
          />
        </CardContent>
      </div>
    </Fragment>
  );
}
