import { FormSelectProps } from "@/types/component/propTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

function FormSelect({ options, placeholder, selectLabel }: FormSelectProps) {
  return (
    <Select>
      <SelectTrigger className="w-max">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default FormSelect;
