
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export interface SelectFilterOption {
  value: string
  label: string
}

export interface SelectFilterProps {
  value?: string
  onChange?: (value: string) => void
  options: SelectFilterOption[]
  placeholder?: string
  className?: string
  defaultValue?: string
  disabled?: boolean
  loading?: boolean
}

export function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
  className,
  defaultValue,
  disabled,
  loading,
}: SelectFilterProps) {
  // Map an empty string to defaultValue only if defaultValue is explicitly provided.
  // Otherwise, leave as undefined so that Radix Select displays the placeholder.
  const selectValue = value ? value : (defaultValue ? defaultValue : undefined)
  const selectedOption = options.find((opt) => opt.value === selectValue)

  const handleValueChange = (val: string) => {
    if (defaultValue && val === defaultValue) {
      onChange?.("")
    } else {
      onChange?.(val)
    }
  }

  return (
    <Select value={selectValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={className} loading={loading}>
        <SelectValue placeholder={placeholder}>
          {selectedOption ? selectedOption.label : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
