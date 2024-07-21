import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { Creditor } from "@/types/creditor/creditorTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import CreditorAPI from "../api/CreditorAPI";
import { creditorFormSchema } from "./formScheme";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export function RegisterForm(props: {
  isEditMode?: boolean;
  creditor?: Creditor;
}) {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultValues: Partial<CreditorFormValues> = props.isEditMode
    ? {
        shopName: props.creditor.shopName,
        contactPersonName: props.creditor.contactPersonName,
        email: props.creditor.email,
        primaryContact: props.creditor.primaryContact,
        secondaryContact: props.creditor.secondaryContact,
        creditLimit: props.creditor.creditLimit.toString(),
        maxDuePeriod: props.creditor.maxDuePeriod.toString(),
      }
    : {};

  const form = useForm<CreditorFormValues>({
    resolver: zodResolver(creditorFormSchema),
    defaultValues,
  });

  const createCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) =>
      creditorService.createCreditor(data),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditors"] });
      form.reset();
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully created creditor.",
        className: "bg-green-200",
        action: (
          <ToastAction altText="View Creditors">
            <Link to={"creditors/manage"}>View Creditors</Link>{" "}
          </ToastAction>
        ),
      });
    },
    onError: (data: any) => {
      toast({
        variant: "destructive",
        title: data.response.data,
        description: "Failed with status code : " + data.response.status,
        duration: 5000,
      });
    },
  });

  const updateCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) =>
      creditorService.updateCreditor(data, props.creditor.creditorID),
    onSuccess: (updatedCreditor) => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditors"] });
      // Convert creditLimit and maxDuePeriod to strings
      const formattedCreditor = {
        ...updatedCreditor,
        creditLimit: updatedCreditor.creditLimit.toString(),
        maxDuePeriod: updatedCreditor.maxDuePeriod.toString(),
      };
      form.reset(formattedCreditor);
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully Updated creditor.",
        className: "bg-green-200",
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

  function onSubmit(data: CreditorFormValues) {
    if (props.isEditMode === true) {
      updateCreditorMutation.mutate(data);
    } else createCreditorMutation.mutate(data);

    if (createCreditorMutation.isSuccess || updateCreditorMutation.isSuccess)
      form.reset();
  }

  if (createCreditorMutation.isPending || updateCreditorMutation.isPending) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 grid-rows-3 gap-x-7 grid-flow-row mb-10 w-full">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Type name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPersonName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Contact Person Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    {...field}
                    placeholder="Type name"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    type="email"
                    {...field}
                    placeholder="Type email"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryContact"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Primary Contact No </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    type="tel"
                    {...field}
                    placeholder="Type contact no"
                    minLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryContact"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Secondary Contact No </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    type="number"
                    {...field}
                    placeholder="Type contact no"
                    minLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditLimit"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Credit Limit </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    type="number"
                    {...field}
                    placeholder="Type credit limit"
                    minLength={4}
                  />
                </FormControl>
                <FormDescription>
                  Enter the maximum amount this creditor is eligible to borrow
                  in LKR
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDuePeriod"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Max credit due period </FormLabel>
                <FormControl>
                  <Controller
                    name="maxDuePeriod"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 week</SelectItem>
                          <SelectItem value="2">2 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormDescription>
                  Enter the max number of time period that a creditor can remain
                  their due balance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {props.isEditMode != true && (
          <>
            <Button type="submit" className="mr-5 w-40">
              Register Creditor
            </Button>
            <Button
              onClick={() => form.reset(defaultValues)}
              variant={"outline"}
              className="w-40"
            >
              Reset
            </Button>
          </>
        )}

        {props.isEditMode === true && (
          <Button
            type="submit"
            className="mr-5 w-40"
            disabled={!form.formState.isDirty}
          >
            Update Creditor
          </Button>
        )}
      </form>
    </Form>
  );
}

const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 grid-rows-3 gap-x-7 grid-flow-row mb-10 w-full">
      {[...Array(7)].map((_, index) => (
        <div key={index} className="space-y-5">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-40" />
    </div>
  </div>
);
