"use client";

import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs sub-components must be used within a <Tabs> parent");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ defaultValue, children, onChange, className = "" }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultValue);

  const setActiveTab = (value: string) => {
    setActiveTabState(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex flex-col w-full gap-4 ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TabHeader({ children, className = "" }: TabHeaderProps) {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/30 rounded-bento-control w-fit max-w-full overflow-x-auto shrink-0 scrollbar-none ${className}`}
    >
      {children}
    </div>
  );
}

interface TabHeaderButtonProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabHeaderButton({ value, children, className = "" }: TabHeaderButtonProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1.5 rounded-bento-control text-xs font-bold transition-all duration-200 cursor-pointer outline-none ${
        isActive
          ? "bg-white dark:bg-zinc-850 text-zinc-950 dark:text-zinc-50 shadow-sm border border-zinc-250/50 dark:border-zinc-800/50"
          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-transparent border border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface TabBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TabBody({ children, className = "" }: TabBodyProps) {
  return (
    <div className={`w-full flex-1 ${className}`}>
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tab({ value, children, className = "" }: TabProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div className={`animate-fadeIn duration-200 ${className}`}>
      {children}
    </div>
  );
}
