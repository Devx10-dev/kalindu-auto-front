import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "./components/RegisterForm";
import Loading from "@/components/Loading";
import { useQueryClient, useQuery,useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorService from "./service/CreditorService";
import { useEffect, useState } from "react";
import { creditorFormSchema } from "./components/formScheme";
import { z } from "zod";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export default function RegisterCreditor() {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorService(axiosPrivate);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["creditors"],
    queryFn: ()=>creditorService.fetchCreditors(),
  });

  const createCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) => creditorService.createCreditor(data),
    onSuccess: queryClient.invalidateQueries(["creditors"])
  });

  if (isLoading) {
    return <Loading />;
  } else
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">Register Creditor</h3>
          <p className="text-sm text-muted-foreground">
            Register Creditor by filling out the following details
          </p>
        </div>
        <Separator />
        <RegisterForm createCreditorMutation={createCreditorMutation}/>
      </div>
    );
}
