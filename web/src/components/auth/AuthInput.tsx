"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <input
          ref={ref}
          className={`
            h-12 w-full rounded-[10px] bg-[#FAFAFA] px-4
            font-body text-sm text-neutral-900
            border placeholder:text-[rgba(17,24,39,0.5)]
            focus:outline-none focus:border-primary
            transition-colors
            ${error ? "border-error" : "border-[#E5E7EB] focus:border-primary"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="font-body text-xs text-error pl-1">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
