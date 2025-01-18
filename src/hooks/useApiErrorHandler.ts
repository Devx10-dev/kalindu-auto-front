import { toast } from "@/components/ui/use-toast";

const useApiErrorHandler = () => {
  const handleError = (error: Error) => {
    const err = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      err.response?.data?.message || "An unexpected error occurred.";

    toast({
      variant: "destructive",
      title: "Field creation failed",
      description: errorMessage,
      duration: 5000,
    });
  };

  return { handleError };
};

export default useApiErrorHandler;
