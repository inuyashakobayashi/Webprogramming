// components/ui/DatePicker.tsx
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface DatePickerProps {
  date?: Date
  onDateChange: (date?: Date) => void
  className?: string
  placeholder?: string
  error?: string
}

const DatePicker = ({ 
  date, 
  onDateChange, 
  className,
  placeholder = "Wählen Sie ein Datum",
  error 
}: DatePickerProps) => {
  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={error ? "destructive" : "outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-slate-500",
              className
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: de }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={onDateChange}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export { DatePicker }