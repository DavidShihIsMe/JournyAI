"use client";

import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function AuthButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className = "",
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={props.type ?? "submit"}
      disabled={isDisabled}
      className={`
        h-[52px] w-full rounded-[12px] bg-primary
        font-body font-semibold text-base text-white
        flex items-center justify-center gap-2
        transition-colors hover:bg-primary-dark
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <span>{loadingText ?? "Loading..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
