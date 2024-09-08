import CreatableSelectErrorMessage from "@/components/formElements/CreatableSelectErrorMessage";
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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type DummyItemValues = z.infer<typeof dummyItemSchema>;

const defaultValues: Partial<DummyItemValues> = {};

export default function DummyItemForm({
  sparePartService,
  onClose,
  setItems,
  item,
  items,
  outsourcedItems,
  setOutsourcedItems,
}: {
  sparePartService: SparePartService;
  onClose: () => void;
  setItems: React.Dispatch<React.SetStateAction<DummyInvoiceItem[]>>;
  item: DummyInvoiceItem | null;
  items: DummyInvoiceItem[];
  setOutsourcedItems: React.Dispatch<React.SetStateAction<OutsourcedItem[]>>;
  outsourcedItems: OutsourcedItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRefs = useRef<any[]>([]);

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
    if (item === null) {
      form.setValue("item", {
        label: undefined,
        value: {
          id: 0,
          value: "",
        },
      });
      form.setValue("remark", undefined);

      form.reset();
    } else {
      form.setValue("remark", item?.description);
      form.setValue("code", item?.code);
      form.setValue("quantity", item?.quantity);
      form.setValue("price", item?.price);
      form.setValue("dummyPrice", item?.dummyPrice);
      form.setValue("outsourced", item?.outsourced ?? false);
      form.setValue("discount", item?.discount);
      form.setValue("item", {
        label: undefined,
        value: {
          id: 0,
          value: "",
        },
      });
    }
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

    if (item !== null) {
      form.setError("item", null);

      setItems(
        items.map((t) =>
          t.id === item.id
            ? {
                new: item.new,
                sparePartId: item.sparePartId,
                name: item.name,
                quantity: values.quantity,
                id: item.id,
                dummyPrice: values.dummyPrice,
                outsourced: values.outsourced,
                code: values.code,
                description: values.remark,
                discount: values.discount,
                outsourceItem: item.outsourceItem,
                price: values.price,
              }
            : t,
        ),
      );

      if (!item.outsourced && values.outsourced) {
        setOutsourcedItems([
          {
            index: item.sparePartId,
            buyingPrice: undefined,
            companyName: undefined,
            itemCode: values.code === undefined ? "" : values.code,
            itemName: item.name,
            quantity: values.quantity,
          },
          ...outsourcedItems,
        ]);
      }

      // form.reset();
      onClose();

      return;
    }

    const isNew = typeof values.item.value === "string";
    const newSparePartId = Math.floor(Math.random() * 100);
    const id = Math.floor(Math.random() * 100);

    setItems([
      {
        sparePartId:
          typeof values.item.value === "string"
            ? newSparePartId
            : values.item.value.id,
        new: isNew ? true : false,
        code: values.code === undefined ? "" : values.code,
        description: values.remark === undefined ? "" : values.remark,
        discount: values.discount === undefined ? 0 : values.discount,
        dummyPrice: values.dummyPrice === undefined ? 0 : values.dummyPrice,
        name: values.item.label,
        price: values.price,
        quantity: values.quantity,
        outsourced: values.outsourced === undefined ? false : values.outsourced,
        id: id,
      },
      ...items,
    ]);

    if (values.outsourced !== undefined && values.outsourced) {
      setOutsourcedItems([
        {
          index:
            typeof values.item.value === "string"
              ? newSparePartId
              : values.item.value.id,
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

  const setItemValues = () => {
    if (item === null) return;

    form.setValue("id", item.sparePartId);
    form.setValue("code", item.code);
    form.setValue("quantity", item.quantity);
    form.setValue("price", item.price);
    form.setValue("dummyPrice", item.dummyPrice);
    form.setValue("discount", item.discount);
    form.setValue("remark", item.description);
    form.setValue("outsourced", item.outsourced);
  };

  useEffect(() => {
    setItemValues();
  }, [item]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="item"
              render={({ field, fieldState }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <RequiredLabel label="Spare Part Item" />
                  <FormControl>
                    <CreatableSelect
                      className="select-place-holder"
                      placeholder={
                        item === null
                          ? "Search and Select or Add new spare part..."
                          : item.name
                      }
                      {...field}
                      isClearable
                      options={sparePartsOptions}
                      value={item === null ? field.value : item.name}
                      onChange={field.onChange}
                      onInputChange={handleInputChange}
                      isDisabled={item !== null}
                    />
                  </FormControl>
                  {item === null && fieldState.error && (
                    <CreatableSelectErrorMessage
                      error={fieldState.error}
                      label="Spare part item"
                      value={field.value}
                    />
                  )}
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
                      ref={(el) => (inputRefs.current[0] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 0)}
                    />
                  </FormControl>
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
                      value={field.value || ""}
                      ref={(el) => (inputRefs.current[1] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 1)}
                    />
                  </FormControl>
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
                      placeholder="Please enter the price ..."
                      value={field.value || ""}
                      ref={(el) => (inputRefs.current[2] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 2)}
                    />
                  </FormControl>
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
                      value={field.value || ""}
                      ref={(el) => (inputRefs.current[3] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 3)}
                    />
                  </FormControl>
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
                      value={field.value || ""}
                      ref={(el) => (inputRefs.current[4] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 4)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <OptionalLabel label="Remarks" />
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full"
                      placeholder="Please enter remarks ..."
                      value={field.value || ""}
                      ref={(el) => (inputRefs.current[5] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outsourced"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      ref={(el) => (inputRefs.current[6] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 6)}
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
                ref={(el) => (inputRefs.current[7] = el)}
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
