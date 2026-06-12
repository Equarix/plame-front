"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FiX, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { direccionSchema, type DireccionFormType } from "../../admin/schemas/persona.schema";
import { DireccionFormFields } from "./DireccionFormFields";
import type { DireccionData } from "@/interface/response.interface";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaId: number;
  onSuccess: (newAddress: DireccionData) => void;
}

export function AddAddressModal({ isOpen, onClose, personaId, onSuccess }: AddAddressModalProps) {
  const { token } = useAuth();

  const methods = useForm<DireccionFormType>({
    resolver: zodResolver(direccionSchema),
    defaultValues: {
      personaId: personaId,
      departamentoId: 0,
      provinciaId: 0,
      distritoId: 0,
      tipoVia: "AVENIDA",
      nombreVia: "",
      numero: "",
      dpto: "",
      interior: "",
      manzana: "",
      lote: "",
      block: "",
      etapa: "",
      tipoZona: "URBANA",
      nombreZona: "",
      referencia: "",
      refiereEssalud: false,
    },
  });

  const { handleSubmit, reset, trigger } = methods;

  const { mutate: submitAddress, isPending } = useMutation({
    mutationFn: async (data: DireccionFormType) => {
      const payload = {
        ...data,
        personaId: personaId,
        departamentoId: Number(data.departamentoId),
        provinciaId: Number(data.provinciaId),
        distritoId: Number(data.distritoId),
      };

      const res = await Api.post(`/persona/add-address/${personaId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data as DireccionData;
    },
    onSuccess: (newAddress) => {
      toast.success("Dirección adicional registrada con éxito");
      onSuccess(newAddress);
      reset();
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al registrar la dirección adicional");
    },
  });

  if (!isOpen) return null;

  const handleAceptar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isValid = await trigger();
    if (isValid) {
      handleSubmit((data) => submitAddress(data))();
    }
  };

  const handleLimpiar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset({
      personaId: personaId,
      departamentoId: 0,
      provinciaId: 0,
      distritoId: 0,
      tipoVia: "AVENIDA",
      nombreVia: "",
      numero: "",
      dpto: "",
      interior: "",
      manzana: "",
      lote: "",
      block: "",
      etapa: "",
      tipoZona: "URBANA",
      nombreZona: "",
      referencia: "",
      refiereEssalud: false,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
              <FiMapPin className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight leading-none text-sm sm:text-base">
                Registrar Segunda Dirección
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-none">
                Ingrese la información detallada para la dirección secundaria de la persona
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form Fields - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1">
          <FormProvider {...methods}>
            <DireccionFormFields />
          </FormProvider>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6 shrink-0">
          <button
            type="button"
            onClick={handleLimpiar}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            Retornar
          </button>
          <button
            type="button"
            onClick={handleAceptar}
            disabled={isPending}
            className="px-4 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-bold shadow-md transition-all cursor-pointer border border-zinc-900/10"
          >
            {isPending ? "Registrando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
