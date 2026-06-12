import React, { useState, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
  error?: string;
  register?: UseFormRegisterReturn;
  extraInputTriggerValue?: string | number;
  extraInputName?: string;
  extraInputLabel?: string;
  extraInputRegister?: UseFormRegisterReturn;
  extraInputError?: string;
  extraInputPlaceholder?: string;
}

export function FormSelect({
  label,
  name,
  options,
  disabled = false,
  error,
  register,
  extraInputTriggerValue,
  extraInputName,
  extraInputLabel,
  extraInputRegister,
  extraInputError,
  extraInputPlaceholder,
  ...rest
}: FormSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    (rest.value as string | number) || (rest.defaultValue as string | number) || ""
  );
  const [isExtraInputOpen, setIsExtraInputOpen] = useState(false);

  useEffect(() => {
    if (rest.value !== undefined) {
      setSelectedValue(rest.value as string | number);
    } else if (rest.defaultValue !== undefined) {
      setSelectedValue(rest.defaultValue as string | number);
    }
  }, [rest.value, rest.defaultValue]);

  useEffect(() => {
    if (selectedValue !== extraInputTriggerValue) {
      setIsExtraInputOpen(false);
    }
  }, [selectedValue, extraInputTriggerValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);
    if (register && register.onChange) {
      register.onChange(e);
    }
    if (rest.onChange) {
      rest.onChange(e);
    }
  };

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
        onChange={handleSelectChange}
        {...(rest.value !== undefined ? { value: selectedValue } : {})}
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

      {extraInputTriggerValue !== undefined && selectedValue === extraInputTriggerValue && (
        <div className="mt-2.5">
          {!isExtraInputOpen ? (
            <button
              type="button"
              onClick={() => setIsExtraInputOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-bento-secondary hover:text-bento-secondary-dark bg-bento-secondary/10 dark:bg-bento-secondary/5 hover:bg-bento-secondary/20 rounded-bento-control transition-all cursor-pointer"
            >
              <span>{`Especificar ${label.toLowerCase()}`}</span>
            </button>
          ) : (
            <div className="flex flex-col w-full gap-1.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={extraInputName}
                  className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 select-none"
                >
                  {extraInputLabel || `Especifique ${label.toLowerCase()}`}
                </label>
                <button
                  type="button"
                  onClick={() => setIsExtraInputOpen(false)}
                  className="text-xs font-semibold text-zinc-450 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors"
                >
                  Ocultar
                </button>
              </div>

              <input
                type="text"
                id={extraInputName}
                placeholder={extraInputPlaceholder || "Escriba aquí..."}
                {...(extraInputRegister || {})}
                className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
                  extraInputError
                    ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                    : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
                }`}
              />

              {extraInputError && (
                <p className="mt-1 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
                  <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
                  {extraInputError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
