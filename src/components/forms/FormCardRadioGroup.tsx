import React from "react";
import { FiCheck } from "react-icons/fi";

interface CardRadioOption {
  value: string;
  label: string;
  desc?: string;
}

interface FormCardRadioGroupProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: CardRadioOption[];
  error?: string;
}

export function FormCardRadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  error,
}: FormCardRadioGroupProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      {label && (
        <span className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1 select-none">
          {label}
        </span>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-start gap-4 p-4 border rounded-bento-control cursor-pointer select-none transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                isSelected
                  ? "border-bento-secondary bg-bento-secondary/5 dark:bg-bento-secondary/5 ring-1 ring-bento-secondary"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-bento-secondary bg-bento-secondary"
                      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  }`}
                >
                  {isSelected && <FiCheck className="text-[10px] text-zinc-950 font-bold" />}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-100 block">
                  {opt.label}
                </span>
                {opt.desc && (
                  <span className="text-[10px] text-zinc-455 dark:text-zinc-500 mt-1 block leading-normal">
                    {opt.desc}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
          <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
          {error}
        </p>
      )}
    </div>
  );
}
