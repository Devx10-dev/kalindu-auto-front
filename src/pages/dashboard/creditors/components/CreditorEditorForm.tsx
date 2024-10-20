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
import { RequiredLabel } from "@/components/formElements/FormLabel";
import { useRef } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Save } from "lucide-react";
type CreditorFormValues = z.infer<typeof creditorFormSchema>;

export function CreditorEditorForm(props: {
  isEditMode?: boolean;
  creditor?: Creditor;
}) {
  //     ----------     VARIABLE INITIALIZATION     ----------     //

  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // for the edit mode the default values will be propagated using the provided creditor data.
  const defaultValues: Partial<CreditorFormValues> = props.isEditMode
    ? {
        shopName: props.creditor.shopName,
        contactPersonName: props.creditor.contactPersonName,
        email: props.creditor.email,
        primaryContact: props.creditor.primaryContact,
        secondaryContact: props.creditor.secondaryContact,
        creditLimit: props.creditor.creditLimit,
        maxDuePeriod: props.creditor.maxDuePeriod.toString(),
        address: props.creditor.address,
      }
    : {};

  const form = useForm<CreditorFormValues>({
    resolver: zodResolver(creditorFormSchema),
    defaultValues,
  });

  const inputRefs = useRef<any[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  //     ----------     BACKEND API FUNCTIONS     ----------     //

  //create creditor mutation
  const createCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) => creditorAPI.createCreditor(data),

    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditors"] });
      form.reset();
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully created creditor ✅",
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
        title: "Creating creditor failed 🤕",
        description: data.response.data,
        duration: 5000,
      });
    },
  });

  // update creditor mutation and logic
  const updateCreditorMutation = useMutation({
    mutationFn: (data: CreditorFormValues) =>
      creditorAPI.updateCreditor(
        getModifiedCreditorFields(data, props.creditor),
        props.creditor.creditorID,
      ),

    onSuccess: (updatedCreditor) => {
      queryClient.invalidateQueries({ queryKey: ["creditors"] });
      // Convert creditLimit and maxDuePeriod to strings
      const formattedCreditor = {
        ...updatedCreditor,
        maxDuePeriod: updatedCreditor.maxDuePeriod.toString(),
      };
      form.reset(formattedCreditor);
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully Updated creditor ✅",
        className: "bg-green-200",
      });
    },

    onError: (data: any) => {
      toast({
        variant: "destructive",
        title: "Updating creditor failed 🤕",
        description: data.response.data,
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

  //     ----------     HELPER FUNCTIONS     ----------     //

  // when updating the creditor we only need to send the updated values to the backend.
  // this function will remove any not updated values from the request data to be generated
  function getModifiedCreditorFields(
    newData: CreditorFormValues,
    originalCreditor: Creditor,
  ) {
    const modifiedFields: any = {};

    (Object.keys(newData) as Array<keyof CreditorFormValues>).forEach((key) => {
      if (newData[key] !== originalCreditor[key]) {
        modifiedFields[key] = newData[key];
      }
    });

    return modifiedFields;
  }

  if (createCreditorMutation.isPending || updateCreditorMutation.isPending) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-5 grid-flow-row mb-10 w-full pb-0">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Shop Name" />
                <FormControl>
                  <Input
                    {...field}
                    ref={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className="w-full"
                    placeholder="Please enter the shop name"
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
                <RequiredLabel label="Contact Person Name" />
                <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                  <Input
                    className="w-full"
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    {...field}
                    placeholder="Please enter the contact person name"
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
                <RequiredLabel label="Email Address" />
                <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    className="w-full"
                    type="email"
                    {...field}
                    placeholder="Please enter the email address"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Address" />
                <FormControl ref={(el) => (inputRefs.current[4] = el)}>
                  <Input
                    className="w-full"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    {...field}
                    placeholder="Please enter the address"
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
                <RequiredLabel label="Primary Contact No" />
                <FormControl ref={(el) => (inputRefs.current[5] = el)}>
                  <Input
                    className="w-full"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    {...field}
                    placeholder="Please enter primary contact no"
                  />
                </FormControl>
                <FormDescription>Ex : 0771234567</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryContact"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Secondary Contact No" />
                <FormControl ref={(el) => (inputRefs.current[6] = el)}>
                  <Input
                    className="w-full"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                    {...field}
                    placeholder="Please enter the secondary contact no"
                  />
                </FormControl>
                <FormDescription>Ex : 0771234567</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditLimit"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Credit Limit" />
                <FormControl ref={(el) => (inputRefs.current[7] = el)}>
                  <Input
                    className="w-full"
                    type="number"
                    min={0}
                    {...field}
                    placeholder="please enter the credit limit"
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                    minLength={4}
                    onChange={(event) => {
                      form.setValue(
                        "creditLimit",
                        parseInt(event.target.value),
                        { shouldDirty: true },
                      );
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Maximum amount this creditor is eligible to borrow
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
                <RequiredLabel label="Credit due period" />
                <FormControl ref={(el) => (inputRefs.current[8] = el)}>
                  <Controller
                    name="maxDuePeriod"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit due period" />
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
                  Max due period that a creditor can remain his due balance
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
          <div className="flex  justify-between">
            <Button
              onClick={() => form.reset(defaultValues)}
              variant={"outline"}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => form.reset(defaultValues)}
                variant={"outline"}
                disabled={!form.formState.isDirty}
              >
                Reset
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                {updateCreditorMutation.isPending ? (
                  <ReloadIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                {updateCreditorMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
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
