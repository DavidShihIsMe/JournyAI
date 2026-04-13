"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-neutral-800"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          h-12 rounded-[10px] bg-neutral-100 px-4
          font-body text-base text-neutral-900
          border border-transparent
          placeholder:text-neutral-400
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          ${error ? "border-error focus:border-error focus:ring-error" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="font-body text-sm text-error">{error}</p>
      )}
    </div>
  );
}
