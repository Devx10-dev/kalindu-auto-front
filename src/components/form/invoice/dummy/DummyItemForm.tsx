import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { dummyItemSchema } from "@/validation/schema/invoice/dummy/DummyItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type DummyItemValues = z.infer<typeof dummyItemSchema>;

const defaultValues: Partial<DummyItemValues> = {};

export default function DummyItemForm({
  sparePartService,
  onClose,
  setItems,
  items,
  outsourcedItems,
  setOutsourcedItems,
}: {
  sparePartService: SparePartService;
  onClose: () => void;
  setItems: React.Dispatch<React.SetStateAction<DummyInvoiceItem[]>>;
  items: DummyInvoiceItem[];
  setOutsourcedItems: React.Dispatch<React.SetStateAction<OutsourcedItem[]>>;
  outsourcedItems: OutsourcedItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: spareParts } = useQuery({
    queryKey: ["spareParts", searchTerm],
    queryFn: () => sparePartService.fetchSpaerPartsByNameOrCode(searchTerm),
    retry: 2,
  });

  const form = useForm<DummyItemValues>({
    resolver: zodResolver(dummyItemSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("remark", undefined);
    form.setValue("item", {
      label: undefined,
      value: {
        id: 0,
        chassisNo: "",
        code: "",
        description: "",
        partName: "",
        quantity: 0,
      },
    });
    form.reset();
  };

  const sparePartsOptions =
    spareParts?.map((sparePart) => ({
      value: sparePart,
      label: sparePart.partName,
    })) || [];

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    onClose();
  };

  const handleSubmit = async (values: DummyItemValues) => {
    let validationError: string | null = null;

    if (values.price === undefined) {
      validationError = "The price field is required. Please enter a value.";
    }
    if (values.quantity === undefined) {
      validationError = "Quantity field is required. Please enter a value.";
    }

    if (validationError !== null) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
      });
      return;
    }

    const isNew = typeof values.item.value === "string";
    const newSparePartId = Math.floor(Math.random() * 100);

    setItems([
      {
        sparePartId: isNew ? newSparePartId : values.item.value.id,
        new: isNew ? true : false,
        code: values.code === undefined ? "" : values.code,
        description: values.remark === undefined ? "" : values.remark,
        discount: values.discount === undefined ? 0 : values.discount,
        dummyPrice: values.dummyPrice === undefined ? 0 : values.dummyPrice,
        name: values.item.label,
        price: values.price,
        quantity: values.quantity,
        outsourced: values.outsourced === undefined ? false : values.outsourced,
      },
      ...items,
    ]);

    if (values.outsourced !== undefined && values.outsourced) {
      setOutsourcedItems([
        {
          index: isNew ? newSparePartId : values.item.value.id,
          buyingPrice: undefined,
          companyName: undefined,
          itemCode: values.code === undefined ? "" : values.code,
          itemName: values.item.label,
          quantity: values.quantity,
        },
        ...outsourcedItems,
      ]);
    }

    form.reset();
    onClose();
  };

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  return (
    <div style={{ padding: 10 }}>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <RequiredLabel label="Spare Part Item" />
                  <FormControl>
                    <CreatableSelect
                      className="select-place-holder"
                      placeholder={"Search and Select or Add new spare part..."}
                      {...field}
                      isClearable
                      options={sparePartsOptions}
                      value={field.value}
                      onChange={field.onChange}
                      onInputChange={handleInputChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <OptionalLabel label="Item Code" />
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Please enter spare part code ..."
                      value={field.value || ""}
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
                <FormItem className="w-full col-span-1 row-span-1">
                  <RequiredLabel label="Quantity" />
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Please enter quantity ..."
                      type="number"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                        )
                      }
                      max={
                        typeof form.getValues("item.value") === "string"
                          ? 1000
                          : form.getValues("item.value.quantity")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <RequiredLabel label="Price" />
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Please enter price ..."
                      type="number"
                      min={0}
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dummyPrice"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <OptionalLabel label="Dummy Price" />
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Please enter dummy price ..."
                      type="number"
                      min={0}
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <OptionalLabel label="Discount" />
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Please enter discount ..."
                      type="number"
                      min={0}
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <OptionalLabel label="Remark" />
                  <FormControl>
                    <Textarea
                      className="w-full"
                      {...field}
                      placeholder="Add a remark ..."
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outsourced"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                  <FormControl>
                    <Checkbox
                      defaultChecked={false}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Spare part item is outsourced</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} variant={"outline"}>
              Cancel
            </Button>
            <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
            <div>
              <Button
                className="mr-2"
                onClick={() => handleSubmit(form.getValues())}
              >
                Save
              </Button>
              <Button type="reset" variant={"outline"} onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
