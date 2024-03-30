import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { accountFormSchema } from "./formScheme";
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
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

export function RegisterForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 grid-rows-4 w-1/2 gap-x-7 gap-y-0 grid-flow-row">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} className="w-full" />
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
                    placeholder="Contact person name"
                    className="w-full"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email address"
                    className="w-full"
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryContactNo"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Primary Contact No </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Primary contact"
                    className="w-full"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryContactNo"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Secondary Contact No </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Secondary contact"
                    className="w-full"
                    type="text"
                    {...field}
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
                    placeholder="Credit limit"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the maximum amount this creditor is eligible to borrow
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxCreditDuePeriod"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <FormLabel>Max credit due period </FormLabel>
                <FormControl>
                  <Controller
                    name="maxCreditDuePeriod"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
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
        <Button type="reset" variant={"outline"} className="w-40">
          Reset
        </Button>
      </form>
    </Form>
  );
}
