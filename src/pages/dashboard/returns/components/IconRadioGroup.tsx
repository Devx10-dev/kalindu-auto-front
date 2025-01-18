"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  HelpCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  id: string;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
};

type IconRadioGroupProps = {
  options: Option[];
  onChange?: (selectedId: string) => void;
  defaultSelected?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
};

const sizeClasses = {
  xxs: "w-16 h-16",
  xs: "w-20 h-20",
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-40 h-40",
};

const iconSizes = {
  xxs: "w-4 h-4",
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const checkMarkSizes = {
  xxs: "w-2 h-2 top-0.5 right-0.5",
  xs: "w-3 h-3 top-1 right-1",
  sm: "w-4 h-4 top-1 right-1",
  md: "w-5 h-5 top-2 right-2",
  lg: "w-6 h-6 top-3 right-3",
};

const IconRadioGroup: React.FC<IconRadioGroupProps> = ({
  options,
  onChange,
  defaultSelected,
  size = "md",
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSelected) {
      const defaultOption = options.find(
        (option) => option.id === defaultSelected && !option.disabled,
      );
      if (defaultOption) {
        setSelectedId(defaultOption.id);
      }
    }
  }, [defaultSelected, options]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onChange) {
      onChange(id);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <Popover key={option.id}>
          <PopoverTrigger asChild>
            <button
              onClick={() => !option.disabled && handleSelect(option.id)}
              className={`relative ${sizeClasses[size]} border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedId === option.id
                  ? "border-green-500 bg-green-50"
                  : option.disabled
                    ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              aria-pressed={selectedId === option.id}
              disabled={option.disabled}
            >
              <div
                className={`flex flex-col items-center justify-center h-full ${option.disabled ? "opacity-50" : ""}`}
              >
                <option.icon className={`${iconSizes[size]} mb-2`} />
                <span
                  className={`text-sm font-medium text-center px-2 ${size === "sm" ? "text-xs" : ""}`}
                >
                  {option.label}
                </span>
              </div>
              {selectedId === option.id && !option.disabled && (
                <Check
                  className={`absolute ${checkMarkSizes[size]} text-green-500`}
                />
              )}
              {option.disabled && option.disabledReason && (
                <HelpCircle
                  className={`absolute ${checkMarkSizes[size]} text-gray-400`}
                />
              )}
            </button>
          </PopoverTrigger>
          {option.disabled && option.disabledReason && (
            <PopoverContent className="w-64 text-sm">
              <p>{option.disabledReason}</p>
            </PopoverContent>
          )}
        </Popover>
      ))}
    </div>
  );
};

export default IconRadioGroup;
