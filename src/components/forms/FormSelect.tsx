import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
  error?: string;
  register?: UseFormRegisterReturn;
}

export function FormSelect({
  label,
  name,
  options,
  disabled = false,
  error,
  register,
  ...rest
}: FormSelectProps) {
  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1.5 select-none"
      >
        {label}
      </label>

      <select
        {...(register || {})}
        {...rest}
        id={name}
        disabled={disabled}
        className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
          error
            ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
            : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
        }`}
      >
        <option value="">Seleccione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
          <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
          {error}
        </p>
      )}
    </div>
  );
}
