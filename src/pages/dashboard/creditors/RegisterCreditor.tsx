import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "./components/RegisterForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSinglePost } from "@/service/creditorService";
import Loading from "@/components/Loading";

export default function SettingsAccountPage() {
  const queryClient = useQueryClient();
  const { isLoading, error, data, } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchSinglePost,
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
        <RegisterForm />
      </div>
    );
}
