import React, { useRef } from "react";
import { z } from "zod";
import { InvoiceItem } from "@/types/invoice/cashInvoice";
import useCashInvoiceStore from "@/pages/dashboard/invoice/cash/context/useCashInvoiceStore.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  code: z.string().optional(),
  description: z.string().optional(),
  discount: z.number().min(0, "Discount cannot be negative").optional(),
  sparePartId: z.number().optional(),
});

interface EditItemProps {
  item: InvoiceItem;
  onClose: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ item, onClose }) => {
  const { updateInvoiceItem } = useCashInvoiceStore();
  //================ feild navigaton ==================//
  const itemNameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const codeRef = useRef(null);
  const descriptionRef = useRef(null);
  const discountRef = useRef(null);
  const updateItemBtn = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef.current) {
        nextRef.current.focus();
      }
    }
  };
  //================ feild navigaton ==================//
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
      code: item.code || "",
      description: item.description || "",
      discount: item.discount || 0,
      sparePartId: item.sparePartId || -1,
    },
  });

  const onSubmit = (data: any) => {
    updateInvoiceItem({ ...item, ...data });
    onClose();
  };

  return (
    <CardContent className="p-3 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name (Read-only)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl ref={priceRef}>
                    <Input
                      type="number"
                      {...field}
                      onKeyDown={(e) => handleKeyDown(e, quantityRef)}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl ref={quantityRef}>
                    <Input
                      type="number"
                      {...field}
                      onKeyDown={(e) => handleKeyDown(e, codeRef)}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl ref={codeRef}>
                    <Input
                      {...field}
                      onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl ref={descriptionRef}>
                    <Textarea
                      {...field}
                      onKeyDown={(e) => handleKeyDown(e, discountRef)}
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
                  <FormControl ref={discountRef}>
                    <Input
                      type="number"
                      {...field}
                      onKeyDown={(e) => handleKeyDown(e, updateItemBtn)}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 mt-12">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button ref={updateItemBtn} type="submit">
              Update Item
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default EditItem;
