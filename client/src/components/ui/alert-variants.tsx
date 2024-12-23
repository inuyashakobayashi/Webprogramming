// components/ui/alert-variants.ts
import { cva } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 border-slate-200",
        destructive: "border-red-500/50 text-red-500 bg-red-50",
        success: "border-green-500/50 text-green-500 bg-green-50",
        warning: "border-yellow-500/50 text-yellow-500 bg-yellow-50",
        info: "border-blue-500/50 text-blue-500 bg-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const icons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
}