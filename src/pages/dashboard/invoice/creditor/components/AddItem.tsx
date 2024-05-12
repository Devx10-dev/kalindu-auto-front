"use client";

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
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";


const formSchema = z.object({
    itemName: z.string(),
    price: z.any(), // TODO : add number and make validation work
    quantity: z.any(), // TODO : add number and make validation work
    code: z.string().optional(),
    description: z.string().optional(),
    discount: z.any().optional(),
});

const AddItem: React.FC = () => {
    const { addInvoiceItem } = useCreditorInvoiceStore();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemName: "",
            price: 1,
            quantity: 1,
            code: "",
            description: "",
            discount: 0,
        },
    });

    const onSubmit = (data: any) => {
        addInvoiceItem(data);
    };

    return (
        <Card>
            <CardContent className="p-3 shadow-sm bg-slate-300">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="itemName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Item name" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                            <Input type="number" placeholder="Price" {...field} />
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
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Quantity" {...field} />
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
                                            <Input type="text" placeholder="Description" {...field} />
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
                                            <Input type="number" placeholder="Discount" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button type="submit" className="">
                                <PlusCircle className="mr-2" /> Add Item
                            </Button>
                            <Button type="reset" className="bg-slate-500">
                                <XCircle className="mr-2" /> Clear
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddItem;
