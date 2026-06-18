import React, { useState, useEffect, useRef } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface ExtraInputProps {
  extraInputTriggerValue?: string | number;
  extraInputName?: string;
  extraInputLabel?: string;
  extraInputError?: string;
  extraInputPlaceholder?: string;
  extraInputRegister?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    name?: string;
  };
}

interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name">,
    ExtraInputProps {
  label: string;
  name: string;
  options: SelectOption[];
  error?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  function FormSelect(
    {
      label,
      name,
      options,
      disabled = false,
      error,
      extraInputTriggerValue,
      extraInputName,
      extraInputLabel,
      extraInputRegister,
      extraInputError,
      extraInputPlaceholder,
      onChange,
      value,
      ...rest
    },
    ref,
  ) {
    const [selectedValue, setSelectedValue] = useState<string | number>(
      (value as string | number) ?? "",
    );
    const [isExtraInputOpen, setIsExtraInputOpen] = useState(false);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string | number);
      }
    }, [value]);

    useEffect(() => {
      if (selectedValue !== extraInputTriggerValue) {
        setIsExtraInputOpen(false);
      }
    }, [selectedValue, extraInputTriggerValue]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
      onChange?.(e);
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
          {...rest}
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          value={selectedValue}
          onChange={handleSelectChange}
          className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
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

        {extraInputTriggerValue !== undefined &&
          selectedValue === extraInputTriggerValue && (
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
                    {...extraInputRegister}
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
  },
);

FormSelect.displayName = "FormSelect";
