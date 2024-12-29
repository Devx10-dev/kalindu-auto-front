import React, { useState, useEffect } from 'react'
import { Check, HelpCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { round } from '@/utils/round'

type Option = {
  id: string
  icon: React.ElementType
  label: string
  disabled?: boolean
  disabledReason?: string
}

type MultiSelectPriceInputProps = {
  options: Option[]
  onChange?: (selectedOptions: { [key: string]: number | null }) => void
  size?: 'sm' | 'md' | 'lg'
  totalAmount: number
}

const sizeClasses = {
  sm: `w-20 h-20`,
  md: 'w-24 h-24',
  lg: 'w-28 h-28'
}

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
}

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const MultiSelectPriceInput: React.FC<MultiSelectPriceInputProps> = ({ 
  options, 
  onChange,
  size = 'md',
  totalAmount
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number | null }>({})

  const handleToggle = (id: string) => {
    setSelectedOptions(prev => {
      const newSelected = { ...prev }
      if (id in newSelected) {
        delete newSelected[id]
      } else {
        newSelected[id] = null
      }
      if (onChange) {
        onChange(newSelected)
      }
      return newSelected
    })
  }

  const handlePriceChange = (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    setSelectedOptions(prev => {
      const newSelected = { ...prev, [id]: numValue }
      if (onChange) {
        onChange(newSelected)
      }
      return newSelected
    })
  }

  const fillFullAmount = (id: string) => {
    const remainingAmount = totalAmount - Object.values(selectedOptions).reduce((sum, value) => sum + (value || 0), 0)
    handlePriceChange(id, remainingAmount.toString())
  }

  const fillRemainingAmount = (id: string) => {
    const currentTotal = Object.values(selectedOptions).reduce((sum, value) => sum + (value || 0), 0)
    const remainingAmount = totalAmount - currentTotal
    if (remainingAmount > 0) {
      handlePriceChange(id, remainingAmount.toString())
    }
  }

  useEffect(() => {
    const currentTotal = Object.values(selectedOptions).reduce((sum, value) => sum + (value || 0), 0)
    if (currentTotal > totalAmount) {
      alert("Total amount exceeded. Please adjust the values.")
    }
  }, [selectedOptions, totalAmount])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <Popover key={option.id}>
            <PopoverTrigger asChild>
              <button
                onClick={() => !option.disabled && handleToggle(option.id)}
                className={` ${sizeClasses[size]} flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 relative ] ${
                  option.id in selectedOptions
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : option.disabled
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
                aria-pressed={option.id in selectedOptions}
                disabled={option.disabled}
              >
                <option.icon className={`${iconSizes[size]} mb-2`} />
                <span className={`${textSizes[size]} font-medium text-center`}>{option.label}</span>
                {option.id in selectedOptions && !option.disabled && (
                  <Check className={`absolute top-1 right-1 ${iconSizes[size] === 'w-12 h-12' ? 'w-6 h-6' : 'w-4 h-4'} text-green-500`} />
                )}
                {option.disabled && option.disabledReason && (
                  <HelpCircle className={`absolute top-1 right-1 ${iconSizes[size] === 'w-12 h-12' ? 'w-6 h-6' : 'w-4 h-4'} text-gray-400`} />
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
      <div className="space-y-2">
        {Object.entries(selectedOptions).map(([id, value]) => {
          const option = options.find(opt => opt.id === id)
          if (!option) return null
          return (
            <div key={id} className="flex items-center gap-2">
              <Label htmlFor={`price-${id}`} className="w-32 flex-shrink-0">{option.label}</Label>
              <Input
                id={`price-${id}`}
                type="number"
                placeholder="Enter price"
                value={value === null ? '' : value}
                onChange={(e) => handlePriceChange(id, e.target.value)}
                className="w-32"
              />
              <Button onClick={() => fillFullAmount(id)} size="sm">Full</Button>
              <Button onClick={() => fillRemainingAmount(id)} size="sm" variant='secondary'>Remaining</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MultiSelectPriceInput

