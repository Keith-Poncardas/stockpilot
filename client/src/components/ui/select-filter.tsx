
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
  defaultValue = "all",
  disabled,
  loading,
}: SelectFilterProps) {
  // Map an empty string to the defaultValue (usually "all")
  const selectValue = value || defaultValue

  const handleValueChange = (val: string) => {
    if (val === defaultValue) {
      onChange?.("")
    } else {
      onChange?.(val)
    }
  }

  return (
    <Select value={selectValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={className} loading={loading}>
        <SelectValue placeholder={placeholder} />
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
