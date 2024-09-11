import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle } from "lucide-react";
import useCashInvoiceStore from "../context/useCashInvoiceStore.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { RequiredLabel } from "@/components/formElements/FormLabel.tsx";
import { SparePartService } from "@/service/sparePartInventory/sparePartService.ts";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price cannot be negative"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive("Quantity cannot be negative")
    .int("Quantity must be an integer"),
  code: z.string().optional(),
  description: z.string().optional(),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .optional()
    .refine((val) => val >= 0, "Discount cannot be negative"),
  sparePartId: z.number().optional(),
});

const AddItem: React.FC<{
  onClose: () => void;
  sparePartService: SparePartService;
}> = ({ onClose, sparePartService }) => {
  const { addInvoiceItem } = useCashInvoiceStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: 1,
      code: "",
      description: "",
      discount: 0,
      sparePartId: -1,
    },
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data: spareParts } = useQuery({
    queryKey: ["spareParts", searchTerm],
    queryFn: () => sparePartService.fetchSpaerPartsByNameOrCode(searchTerm),
    retry: 2,
  });

  const sparePartsOptions =
    spareParts?.map((sparePart) => ({
      value: sparePart,
      label: sparePart.partName,
    })) || [];

  const onSubmit = (data: any) => {
    addInvoiceItem(data);
    form.reset();
    onClose();
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    onClose();
  };

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  const handleSelectChange = (option: any) => {
    if (option && option.__isNew__) {
      // If the selected option is a new custom option
      form.setValue("name", option.label);
      form.setValue("sparePartId", -1);
    } else if (option) {
      // If the selected option is an existing spare part
      form.setValue("name", option.value.partName);
      form.setValue("sparePartId", option.value.id);
    }
  };
  const onReset = () => {
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel label="Item name" />
                <CreatableSelect
                  options={sparePartsOptions}
                  onInputChange={handleInputChange}
                  isClearable
                  onChange={handleSelectChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel label="Price" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter current price for a item"
                    min={0}
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel label="Quantity" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...field}
                    min={0}
                    step="1"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Code" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Description for the item"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Discount for a item"
                    min={0}
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4 mt-12">
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
          <Button type="submit" className="">
            <PlusCircle className="mr-2" /> Add Item
          </Button>
          <Button type="reset" onClick={onReset} className="bg-slate-500">
            <XCircle className="mr-2" /> Clear
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItem;
