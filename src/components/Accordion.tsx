"use client";

import React, { createContext, useContext, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

// Context to share accordion configuration and state
interface AccordionContextProps {
  activeValues: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({
  children,
  type = "single",
  collapsible = true,
  defaultValue,
  className = "",
}: AccordionProps) {
  const [activeValues, setActiveValues] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const toggleItem = (value: string) => {
    setActiveValues((prev) => {
      const isAlreadyActive = prev.includes(value);

      if (type === "single") {
        if (isAlreadyActive) {
          return collapsible ? [] : prev;
        }
        return [value];
      } else {
        if (isAlreadyActive) {
          return prev.filter((v) => v !== value);
        }
        return [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ activeValues, toggleItem }}>
      <div className={`space-y-2.5 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// Context to share individual item value
const AccordionItemContext = createContext<string | undefined>(undefined);

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({
  children,
  value,
  className = "",
  disabled = false,
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div
        className={`border border-zinc-200/60 dark:border-zinc-800/60 rounded-bento-card bg-white dark:bg-zinc-900 overflow-hidden shadow-sm transition-all duration-200 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        } ${className}`}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!context || itemValue === undefined) {
    throw new Error("AccordionTrigger must be used inside AccordionItem and Accordion");
  }

  const { activeValues, toggleItem } = context;
  const isOpen = activeValues.includes(itemValue);

  return (
    <button
      type="button"
      onClick={() => toggleItem(itemValue)}
      className={`flex items-center justify-between w-full p-4 sm:p-5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-850/30 transition-all duration-200 cursor-pointer ${className}`}
    >
      <span className="flex-1">{children}</span>
      <FiChevronDown
        className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${
          isOpen ? "rotate-180 text-bento-secondary" : ""
        }`}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className = "" }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!context || itemValue === undefined) {
    throw new Error("AccordionContent must be used inside AccordionItem and Accordion");
  }

  const { activeValues } = context;
  const isOpen = activeValues.includes(itemValue);

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className={`p-4 sm:p-5 pt-0 sm:pt-0 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100/50 dark:border-zinc-800/30 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
