import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`
            flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm 
            ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-slate-950 focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }