// components/ui/Alert.tsx
import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { alertVariants, icons } from "./alert-variants"

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, onClose, ...props }, ref) => {
    const Icon = icons[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={alertVariants({ variant, className })}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="flex justify-between">
          <div>
            {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
            {children && <div className="text-sm opacity-90">{children}</div>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-50 hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }