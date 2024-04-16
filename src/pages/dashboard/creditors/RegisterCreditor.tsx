import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "./components/RegisterForm";
import Loading from "@/components/Loading";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorService from "./service/CreditorService";
import { creditorFormSchema } from "./components/formScheme";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

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
