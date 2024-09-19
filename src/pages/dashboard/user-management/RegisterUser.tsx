import PageHeader from "@/components/card/PageHeader";
import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import AddUserIcon from "@/components/icon/AddUserIcon";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { UserService } from "@/service/user/userService";
import { User, userSchema } from "@/validation/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { z } from "zod";
import { useRef } from "react";

function RegisterUser() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // defining the form
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      mobileNo: "",
      homeNo: "",
      designation: "Manager",
      username: "",
      password: "",
      active: true,
      roles: [],
      gender: "Male",
    },
    mode: "onChange",
  });

  const userService = new UserService(axiosPrivate);

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

  // Submit handler
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      if (form.getValues()) {
        if (form.getValues().roles.length === 0) {
          toast({
            variant: "destructive",
            title: "Validation Failed",
            description: "At least one role should be selected",
            duration: 5000,
          });
          return;
        }

        if (
          form.getValues().password === undefined ||
          form.getValues().password === ""
        ) {
          toast({
            variant: "destructive",
            title: "Validation Failed",
            description: "Password is required",
            duration: 5000,
          });
          return;
        }
        if (
          form.getValues().password !== undefined &&
          form.getValues().password !== "" &&
          form.getValues().password !== form.getValues().confirmPassword
        ) {
          toast({
            variant: "destructive",
            title: "Validation Failed",
            description: "Password and confirm password must be the same",
            duration: 5000,
          });
          return;
        }
        await createUserMutation.mutateAsync(form.getValues());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => userService.fetchUserRoles(),
    retry: 2,
  });

  const roleOptions =
    roles?.map((role) => ({
      value: role,
      label: role,
    })) || [];

  const createUserMutation = useMutation({
    mutationFn: (formData: User) => userService.createUser(formData),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully inserted user.",
        action: <ToastAction altText="View Users">View Users</ToastAction>,
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "User creation is failed",
        description: data.message,
        duration: 5000,
      });
    },
  });

  return (
    <div className="space-y-6 pl-2 pr-12">
      <CardHeader>
        <PageHeader
          title="Register User"
          description="Register new user to the system by filling out the following details."
          icon={<AddUserIcon height="30" width="28" color="#162a3b" />}
        />
      </CardHeader>
      <Separator />
      <CardContent style={{ width: "98%" }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Username" />
                    <FormControl ref={(el) => (inputRefs.current[1] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        placeholder="Please enter the username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Full Name" />
                    <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                        placeholder="Please enter user's full name"
                        {...field}
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
                  <FormItem>
                    <OptionalLabel label="Email Address" />
                    <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                        placeholder="Please enter user's email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem className="w-full col-span-1 row-span-1">
                    <RequiredLabel label="Roles" />
                    <FormControl
                      onKeyDown={(e) => handleKeyDown(e, 4)}
                      ref={(el) => (inputRefs.current[4] = el)}
                    >
                      <ReactSelect
                        isMulti
                        options={roleOptions}
                        onChange={(selectedOptions) =>
                          field.onChange(
                            selectedOptions.map((option) => option.value),
                          )
                        }
                        value={roleOptions.filter((option) =>
                          field.value.includes(option.value),
                        )}
                        placeholder={"Select or add new roles"}
                        className="basic-multi-select select-place-holder"
                        classNamePrefix="select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Password" />
                    <FormControl ref={(el) => (inputRefs.current[5] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 5)}
                        type="password"
                        placeholder="Please enter the password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Verify Password" />
                    <FormControl ref={(el) => (inputRefs.current[6] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 6)}
                        type="password"
                        placeholder="Please verify the password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Designation" />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl
                        onKeyDown={(e) => handleKeyDown(e, 7)}
                        ref={(el) => (inputRefs.current[7] = el)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the Designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={Math.random()} value="Manager">
                          Manager
                        </SelectItem>
                        <SelectItem key={Math.random()} value="Cashier">
                          Cashier
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNo"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Mobile Number" />
                    <FormControl ref={(el) => (inputRefs.current[8] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 8)}
                        placeholder="Enter the contact number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeNo"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Home Number" />
                    <FormControl ref={(el) => (inputRefs.current[9] = el)}>
                      <Input
                        onKeyDown={(e) => handleKeyDown(e, 9)}
                        placeholder="Enter the home number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Gender" />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl
                        onKeyDown={(e) => handleKeyDown(e, 10)}
                        ref={(el) => (inputRefs.current[10] = el)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the Designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={Math.random()} value="Male">
                          Male
                        </SelectItem>
                        <SelectItem key={Math.random()} value="Female">
                          Female
                        </SelectItem>
                        <SelectItem key={Math.random()} value="Non Binary">
                          Non Binary
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Address" />
                    <FormControl ref={(el) => (inputRefs.current[11] = el)}>
                      <Textarea
                        onKeyDown={(e) => handleKeyDown(e, 11)}
                        placeholder="Enter user's address"
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5 d-flex gap-4">
                      <OptionalLabel label="Active" />
                      <FormControl
                        onKeyDown={(e) => handleKeyDown(e, 12)}
                        ref={(el) => (inputRefs.current[12] = el)}
                      >
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-start gap-3">
              <Button ref={(el) => (inputRefs.current[13] = el)} type="submit">
                Submit
              </Button>
              <Button type="reset" variant="destructive">
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default RegisterUser;
