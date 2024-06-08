import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { RegisterForm } from "./components/RegisterForm";
import { creditorFormSchema } from "./components/formScheme";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export default function RegisterCreditor() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Register Creditor</h3>
        <p className="text-sm text-muted-foreground">
          Register Creditor by filling out the following details
        </p>
      </div>
      <Separator />
      <RegisterForm />
    </div>
  );
}
