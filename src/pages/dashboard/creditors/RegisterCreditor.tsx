import PageHeader from "@/components/card/PageHeader";
import UserWithLines from "@/components/icon/UserWithLines";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { RegisterForm } from "./components/CreditorForm";
import { creditorFormSchema } from "./components/formScheme";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export default function RegisterCreditor() {
  return (
    <div className="space-y-6 p-10">
      <div>
        <PageHeader
          title="Register Creditor"
          description="Register creditor with the necessary information"
          icon={<UserWithLines height="30" width="28" color="#162a3b" />}
        />
      </div>
      <Separator />
      <RegisterForm />
    </div>
  );
}
