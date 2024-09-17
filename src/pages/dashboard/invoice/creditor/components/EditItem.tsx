import React from "react";
import { z } from "zod";
import { InvoiceItem } from "@/types/invoice/cashInvoice";
import useCreditorInvoiceStore from "@/pages/dashboard/invoice/creditor/context/useCreditorInvoiceStore.tsx";
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
  const { updateInvoiceItem } = useCreditorInvoiceStore();

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
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
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
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
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
                  <FormControl>
                    <Input {...field} />
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
                  <FormControl>
                    <Textarea {...field} />
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
                      {...field}
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
            <Button type="submit">Update Item</Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default EditItem;
