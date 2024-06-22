import Loading from "@/components/Loading";
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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import CreditorAPI from "../api/CreditorAPI";
import { creditorFormSchema } from "./formScheme";

type CreditorFormValues = z.infer<typeof creditorFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CreditorFormValues> = {};

export function RegisterForm() {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorAPI(axiosPrivate);
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
        className:'bg-green-200',
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

  const form = useForm<CreditorFormValues>({
    resolver: zodResolver(creditorFormSchema),
    defaultValues,
  });

  function onSubmit(data: CreditorFormValues) {
    createCreditorMutation.mutate(data);
    if (createCreditorMutation.isSuccess) form.reset();
  }

  if (createCreditorMutation.isPending) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <div className="grid grid-cols-3 grid-rows-3 w-1/2 gap-x-7 grid-flow-row mb-10 w-full">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" placeholder="Type" />
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
                  <Input className="w-full" {...field} placeholder="Type" />
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
                  <Input className="w-full" type="email" {...field} placeholder="Type" />
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
                  <Input className="w-full" type="tel" {...field} placeholder="Type" minLength={10} />
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
                  <Input className="w-full" type="number" {...field} placeholder="Type" minLength={10} />
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
                  <Input className="w-full" type="number" {...field} placeholder="Type" minLength={4} />
                </FormControl>
                <FormDescription>
                  Enter the maximum amount this creditor is eligible to borrow in LKR
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

        <Button type="submit" className="mr-5 w-40">
          Register Creditor
        </Button>
        <Button onClick={()=>form.reset(defaultValues)} variant={"outline"} className="w-40">
          Reset
        </Button>
      </form>
    </Form>
  );
}
