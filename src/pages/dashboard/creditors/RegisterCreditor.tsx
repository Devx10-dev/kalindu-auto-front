import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { RegisterForm } from "./components/RegisterForm";
import { creditorFormSchema } from "./components/formScheme";
import CreditorService from "./service/CreditorService";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export default function RegisterCreditor() {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorService(axiosPrivate);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) =>
      creditorService.createCreditor(data),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditors"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully created creditor.",
        action: (
          <ToastAction altText="View Creditors">View Creditors</ToastAction>
        ),
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Something went wrong : " + data.name,
        description: data.message,
        duration: 5000,
      });
    },
  });

  if (createCreditorMutation.isPending) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Register Creditor</h3>
        <p className="text-sm text-muted-foreground">
          Register Creditor by filling out the following details
        </p>
      </div>
      <Separator />
      <RegisterForm createCreditor={createCreditorMutation} />
    </div>
  );
}
