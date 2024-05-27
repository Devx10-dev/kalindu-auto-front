import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import {
  ArrowDown,
  ArrowUp,
  BrickWall,
  CalendarIcon,
  Circle,
  DeleteIcon,
  DraftingCompass,
  Plus,
  ReceiptEuro,
  Save,
  Verified
} from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useFieldArray, useForm } from "react-hook-form";

interface FieldData {
  name?: string;
  category: string;
  amount: number | null;
}

interface CategoryData {
  fields: FieldData[];
}

interface InputData {
  fields: CategoryData[];
}

interface RefinedData {
  [category: string]: { name: string | undefined; amount: number | null }[];
}

const DailySalesBase = () => {
  const { control, handleSubmit, register } = useForm();
  const { fields, append, remove,  } = useFieldArray({
    control,
    name: "fields",
  });
  console.log(fields);
  const [date, setDate] = useState<Date>();

  // Define the form fields and their categories
  const dailySalesCategory = [
    {
      name: "Main",
      fields: [
        { type: "INCOME", fieldName: "Daily Sales" },
        { type: "INCOME", fieldName: "Opening Cash" },
        { type: "INCOME", fieldName: "Other Income" },
        { type: "RECORD", fieldName: "Gross Total" },
      ],
    },
    {
      name: "Bank Deposits",
      fields: [
        { type: "DEPOSIT", fieldName: "Sampath Deposited" },
        { type: "DEPOSIT", fieldName: "HNB Deposited" },
      ],
    },
    {
      name: "Salary",
      fields: [
        { type: "EXPENSE", fieldName: "Shantha Aiya Salary" },
        { type: "EXPENSE", fieldName: "Salary Advance" },
        { type: "EXPENSE", fieldName: "Kumaran Uncle Salary/Things" },
        { type: "EXPENSE", fieldName: "Mangala Aiya Salary" },
        { type: "EXPENSE", fieldName: "Pradeep Ayya Salary" },
        { type: "EXPENSE", fieldName: "Prema Aunty Salary" },
      ],
    },
    {
      name: "Other Expenses",
      fields: [
        { type: "EXPENSE", fieldName: "Old Bills" },
        { type: "EXPENSE", fieldName: "Tea Expenses" },
        { type: "EXPENSE", fieldName: "Return Bill" },
        { type: "EXPENSE", fieldName: "Donation" },
        { type: "EXPENSE", fieldName: "Transport" },
        { type: "EXPENSE", fieldName: "Fuel Expenses" },
        { type: "EXPENSE", fieldName: "Home Expenses" },
        { type: "EXPENSE", fieldName: "Commission" },
        { type: "EXPENSE", fieldName: "Bill Payment" },
        { type: "EXPENSE", fieldName: "Laminating & Print Out" },
        { type: "EXPENSE", fieldName: "Pest Control Bills" },
        { type: "EXPENSE", fieldName: "Outside Vehicle Parts" },
        { type: "EXPENSE", fieldName: "Material Goods" },
        { type: "EXPENSE", fieldName: "Shipment Food/Vehicle Cost" },
        { type: "EXPENSE", fieldName: "Courier Payment" },
        { type: "EXPENSE", fieldName: "Other Expenses" },
        { type: "RECORD", fieldName: "Total Deduction" },
        { type: "RECORD", fieldName: "Sales After Expenses" },
        { type: "RECORD", fieldName: "Percentage" },
      ],
    },
    {
      name: "Summary",
      fields: [
        { type: "RECORD", fieldName: "Daily Cash Sale" },
        { type: "RECORD", fieldName: "Daily Credit Sale" },
        { type: "RECORD", fieldName: "Daily Cheque Deposited" },
        { type: "RECORD", fieldName: "Daily Cheque Received" },
        { type: "RECORD", fieldName: "Daily Deposit Sale" },
        { type: "RECORD", fieldName: "Total Sale" },
      ],
    },
  ];

  const refineData = (data: InputData) => {
    const refinedData: RefinedData = {};

    data.fields.forEach((categoryData) => {
      categoryData.fields.forEach((fieldData) => {
        const { category, name, amount } = fieldData;
        if (!refinedData[category]) {
          refinedData[category] = [];
        }
        refinedData[category].push({ name, amount: amount });
      });
    });

    return refinedData;
  };

  const onSubmit = (data: any) => {
    console.log(data);

    console.log(refineData(data));
  };

  function getFieldBadge(fieldType: string) {
    switch (fieldType) {
      case "INCOME":
        return (
          <Badge className="rounded-md bg-green-100" variant={"outline"}>
            INCOME <ArrowDown className="h-4" />
          </Badge>
        );
      case "EXPENSE":
        return (
          <Badge className="rounded-md bg-orange-100" variant={"outline"}>
            EXPENSE <ArrowUp className="h-4" />
          </Badge>
        );
      case "RECORD":
        return (
          <Badge className="rounded-md bg-purple-100" variant={"outline"}>
            RECORD <Circle className="h-2" />
          </Badge>
        );
      case "DEPOSIT":
        return (
          <Badge className="rounded-md bg-blue-100" variant={"outline"}>
            DEPOSIT <ArrowDown className="h-4" />
          </Badge>
        );

      default:
        return (
          <Badge className="rounded-md bg-gray-100" variant={"outline"}>
            {fieldType} <ArrowDown className="h-4" />
          </Badge>
        );
    }
  }

  const { register: registerNewField, handleSubmit: handleNewFieldSubmit } = useForm();
  const onNewFieldSubmit = (data:any) => {
    const { name, category } = data;
    append({ name, category, amount: undefined });
  };

  return (
    <>
    <h1 className="text-2xl font-bold mb-5">Daily Sales and Expenses Report</h1>

    <Separator className="mb-5"/>

    <div className="mb-5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {!date && <Label className="ml-5 text-red-400">Please select a date</Label> }

        <PopoverContent className="w-full">
          <DayPicker mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="ml-auto">
            {" "}
            <Plus className="mr-2" /> Add New Field
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewFieldSubmit(onNewFieldSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" {...registerNewField("name")} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  {...registerNewField("category")}
                  className="col-span-3"
                  list="categories"
                />
                <datalist id="categories">
                  {dailySalesCategory.map((category) => (
                    <option key={category.name} value={category.name} />
                  ))}
                </datalist>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Field</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)}>
        {dailySalesCategory.map((category, categoryIndex) => (
          <div key={category.name} className="mt-10">
            <h1 className="mb-2 text-xl uppercase">{category.name}</h1>
            <Separator className="mb-5 w-3/4" />
            
            {category.fields.map((field: any, fieldIndex) => (
              <div
                key={`${categoryIndex}-${fieldIndex}`}
                className="flex gap-3  mb-5"
              >
                {/* <Label>{field.type}</Label> */}
                <Input
                  type="text"
                  value={field.fieldName}
                  disabled
                  className="border-b-2 w-2/4 font-semibold text-lg"
                  {...register(
                    `fields.${categoryIndex}.fields.${fieldIndex}.name`,
                    {
                      valueAsNumber: false,
                      value: field.fieldName,
                    }
                  )}
                />
                <Input
                  type="hidden"
                  {...register(
                    `fields.${categoryIndex}.fields.${fieldIndex}.category`,
                    {
                      valueAsNumber: false,
                      value: category.name,
                    }
                  )}
                />

                {/* Dynamically render the field badges according the the field type */}
                {getFieldBadge(field.type)}

                <Input
                  type="number"
                  {...register(
                    `fields.${categoryIndex}.fields.${fieldIndex}.amount`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                  className="border-b-2 w-1/4 text-end"
                />
              </div>
            ))}
          </div>
        ))}
        <div className="flex gap-3 pb-20 pt-5 justify-end pr-20 ">
        <Button className="bg-slate-300 text-black w-36 hover:text-white"><DeleteIcon  className="mr-2"/> Clear All</Button>
        <Button type="submit" className="bg-slate-300 text-black w-36 hover:text-white"><Save className="mr-2" /> Save Draft</Button>
        <Button className="w-36 bg-blue-600"><Verified className="mr-2" /> Verify</Button>
        
        </div>
      </form>
    </>
  );
};

export default DailySalesBase;
