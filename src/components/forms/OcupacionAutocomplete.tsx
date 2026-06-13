import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";
import { FormInput } from "./FormInput";
import type { ApiResponse, OcupacionData } from "@/interface/response.interface";

export function OcupacionAutocomplete() {
  const { token } = useAuth();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedOcupacionId = watch("ocupacionId");
  const selectedOcupacionName = watch("ocupacionNombre");

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<OcupacionData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (ocupacion: OcupacionData) => {
    setValue("ocupacionId", ocupacion.ocupacionId, { shouldValidate: true });
    setValue("ocupacionNombre", ocupacion.name, { shouldValidate: true });
    setSearchQuery(ocupacion.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue("ocupacionId", "", { shouldValidate: true });
    setValue("ocupacionNombre", "", { shouldValidate: true });
    setSearchQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsOpen(false);
    const exactMatch = results.find(
      (r) => r.name.trim().toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (exactMatch) {
      handleSelect(exactMatch);
    } else {
      if (selectedOcupacionName) {
        setSearchQuery(selectedOcupacionName);
      } else {
        setSearchQuery("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        const exactMatch = results.find(
          (r) => r.name.trim().toLowerCase() === searchQuery.trim().toLowerCase()
        );
        handleSelect(exactMatch || results[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Sync initial or reset values
  useEffect(() => {
    if (selectedOcupacionName) {
      setSearchQuery(selectedOcupacionName);
    } else if (!selectedOcupacionId) {
      setSearchQuery("");
    }
  }, [selectedOcupacionName, selectedOcupacionId]);

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        const exactMatch = results.find(
          (r) => r.name.trim().toLowerCase() === searchQuery.trim().toLowerCase()
        );
        if (exactMatch) {
          handleSelect(exactMatch);
        } else {
          if (selectedOcupacionName) {
            setSearchQuery(selectedOcupacionName);
          } else {
            setSearchQuery("");
          }
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOcupacionName, results, searchQuery]);

  // Fetch results when debounced search query changes
  useEffect(() => {
    // Only search if the query is different from the currently selected occupation name
    if (debouncedSearch.trim() && debouncedSearch !== selectedOcupacionName) {
      let isMounted = true;
      setIsLoading(true);

      Api.get<ApiResponse<OcupacionData[]>>("/ocupacion/public", {
        params: { str: debouncedSearch },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (isMounted) {
            setResults(res.data.body || []);
            setIsOpen(true);
          }
        })
        .catch((err) => {
          console.error("Error fetching occupations:", err);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setResults([]);
    }
  }, [debouncedSearch, selectedOcupacionName, token]);



  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4 items-start w-full relative">
      {/* Hidden input to register the form value correctly */}
      <input type="hidden" {...register("ocupacionId")} />
      <input type="hidden" {...register("ocupacionNombre")} />

      {/* Código / ID Column (1/3 width) */}
      <div>
        <FormInput
          label="Código / ID"
          name="ocupacionCodInput"
          value={selectedOcupacionId || ""}
          readOnly
          disabled
          placeholder="Autocompletado"
        />
      </div>

      {/* Nombre de Ocupación Autocomplete Column (2/3 width) */}
      <div className="col-span-2 relative">
        <label className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1.5 select-none">
          Buscar Ocupación
        </label>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Escriba para buscar ocupación (ej. Psicólogo)..."
            className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 pl-3.5 pr-10 ${
              errors.ocupacionId
                ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
            }`}
          />

          {/* Right Icons: Loader / Clear / Search */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-bento-secondary border-t-transparent rounded-full animate-spin" />
            ) : selectedOcupacionId ? (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-bento-danger transition-colors cursor-pointer p-0.5"
                title="Limpiar Selección"
              >
                <FiX className="text-sm" />
              </button>
            ) : (
              <FiSearch className="text-sm" />
            )}
          </div>
        </div>

        {/* Validation Error */}
        {errors.ocupacionId && (
          <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
            <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
            {errors.ocupacionId.message as string}
          </p>
        )}

        {/* Results Dropdown Overlay */}
        {isOpen && (results.length > 0 || searchQuery.trim() !== "") && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-250 dark:border-zinc-800 rounded-bento-control shadow-lg max-h-60 overflow-y-auto overflow-x-hidden animate-fadeIn py-1">
            {results.length > 0 ? (
              results.map((ocupacion) => {
                const isSelected = selectedOcupacionId === ocupacion.ocupacionId;
                return (
                  <button
                    key={ocupacion.ocupacionId}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(ocupacion);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer ${
                      isSelected
                        ? "text-bento-secondary bg-bento-secondary/5 dark:bg-bento-secondary/5"
                        : "text-zinc-750 dark:text-zinc-200"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold">{ocupacion.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        ID: {ocupacion.ocupacionId}
                      </span>
                    </div>
                    {isSelected && <FiCheck className="text-sm shrink-0" />}
                  </button>
                );
              })
            ) : (
              !isLoading && (
                <div className="px-3.5 py-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 text-center select-none">
                  No se encontraron ocupaciones
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
