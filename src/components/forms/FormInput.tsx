import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IconType } from "react-icons";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: IconType;
  register?: UseFormRegisterReturn;
  rightElement?: React.ReactNode;
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  disabled = false,
  error,
  icon: Icon,
  register,
  rightElement,
  ...rest
}: FormInputProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1.5 select-none"
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative flex items-center">
        {/* Left Icon if provided */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Icon className="h-4 w-4" />
          </div>
        )}

        {/* Input Control */}
        <input
          {...rest}
          {...(register || {})}
          type={type}
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 ${
            Icon ? "pl-9" : "pl-3.5"
          } ${rightElement ? "pr-10" : "pr-3.5"} ${
            error
              ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
              : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
          }`}
        />

        {/* Right Element if provided (e.g. eye toggle button) */}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Validation Message */}
      {error && (
        <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
          <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
          {error}
        </p>
      )}
    </div>
  );
}
