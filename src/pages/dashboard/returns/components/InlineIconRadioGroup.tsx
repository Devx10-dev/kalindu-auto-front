"use client"

import React, { useState, useEffect } from 'react'
import { Check, Smartphone, Laptop, Tablet, Monitor, HelpCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Option = {
  id: string
  icon: React.ElementType
  label: string
  disabled?: boolean
  disabledReason?: string
}

type InlineIconRadioGroupProps = {
  options: Option[]
  value: string
  onChange?: (selectedId: string) => void
  defaultSelected?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  xs: 'h-8 px-2 text-xs',
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-5 text-lg'
}

const iconSizes = {
  xs: 'h-4 w-4',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

const InlineIconRadioGroup: React.FC<InlineIconRadioGroupProps> = ({ 
  options, 
  value,
  onChange, 
  defaultSelected,
  size = 'md' 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // useEffect(() => {
  //   if (defaultSelected) {
  //     const defaultOption = options.find(option => option.id === defaultSelected && !option.disabled)
  //     if (defaultOption) {
  //       setSelectedId(defaultOption.id)
  //     }
  //   }
  // }, [defaultSelected])

  useEffect(() => {
    if (value) {
      const defaultOption = options.find(option => option.id === value && !option.disabled)
      if (defaultOption) {
        setSelectedId(defaultOption.id)
      }
    }
  }, [value])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    if (onChange) {
      onChange(id)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <Popover key={option.id}>
          <PopoverTrigger asChild>
            <button
              onClick={() => !option.disabled && handleSelect(option.id)}
              className={`flex items-center justify-center ${sizeClasses[size]} border-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedId === option.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : option.disabled
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
              aria-pressed={selectedId === option.id}
              disabled={option.disabled}
            >
              <option.icon className={`${iconSizes[size]} mr-2 flex-shrink-0`} />
              <span className="font-medium">{option.label}</span>
              {selectedId === option.id && !option.disabled && (
                <Check className={`ml-2 ${iconSizes[size]} text-green-500`} />
              )}
              {option.disabled && option.disabledReason && (
                <HelpCircle className={`ml-2 ${iconSizes[size]} text-gray-400`} />
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
  )
}

export default InlineIconRadioGroup;

