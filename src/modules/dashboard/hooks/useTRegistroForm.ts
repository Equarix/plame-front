import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import type { ApiResponse, PersonaData } from "@/interface/response.interface";
import { personaSchema, type PersonaFormType } from "../../admin/schemas/persona.schema";

export type CategoriaType = "TRABAJADOR" | "PENSIONISTA" | "PERSONAL_FORMACION_LABORAL" | "PERSONAL_TERCERO";

export interface EstudiosInput {
  formacionCompleta: string;
  estudioPeru: boolean;
  privado: boolean;
  tipoEducacion: string;
  nombreInstitucion: string;
  nombreCarrera: string;
  añoEgreso: number;
}

export interface CreateTPersonaInput {
  personaId: number;
  categoria: CategoriaType;
  periodoInicio?: string;
  tipoTrabajador?: string;
  fechaIngreso?: string;
  regimenLaboral?: string;
  ocupacionId?: number;
  tipoContrato?: string;
  tipoPago?: string;
  entidadId?: number;
  montoRemuneracionInicial?: number;
  regimenSalud?: string;
  fechaInicioSalud?: string;
  fechaFinSalud?: string;
  regimenPensionario?: string;
  fechaInicioPensionario?: string;
  fechaFinPensionario?: string;
  CUSPP?: string;
  sctr?: boolean;
  pension?: string;
  salud?: string;
  fechaInicioSaludPension?: string;
  fechaFinSaludPension?: string;
  situacionEducativaId?: number;
  estudios?: EstudiosInput[];
  quintaCategoriaExonerada?: boolean;
  evitaDobleImposicion?: boolean;
  tEmpresaCompanyId?: number;
  periodoIngreso?: string;
  fechaInicio?: string;
  telefono?: string;
  email?: string;
  jornadaLaboral?: string;
  codlocal?: string;
  situacionEspecial?: string;
  discapacidad?: boolean;
  sindicalizado?: boolean;
}

export function useTRegistroForm() {
  const { token, companyId } = useAuth();

  const [selectedPersona, setSelectedPersona] = useState<PersonaData | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formPhase, setFormPhase] = useState<"search" | "register">("search");
  const [searchDni, setSearchDni] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"resumen" | "trabajador" | "pensionista" | "formacion">("resumen");

  // Radio button category selection inside Resumen de Prestadores
  const [categoria, setCategoria] = useState<CategoriaType>("TRABAJADOR");

  // Phone and Email state for TPersona
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Sync phone and email when selectedPersona changes
  useEffect(() => {
    if (selectedPersona) {
      setTelefono(selectedPersona.telefono || "");
      setEmail(selectedPersona.email || "");
    } else {
      setTelefono("");
      setEmail("");
    }
  }, [selectedPersona]);

  // Zod hook-form for registration
  const methods = useForm<PersonaFormType>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      dni: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidad: "PERUANA",
      direccion: {
        personaId: 0,
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
    },
  });

  const { reset, setValue } = methods;

  const handleOpenSearch = () => {
    setFormPhase("search");
    setSearchDni("");
    setIsModalOpen(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(searchDni)) {
      toast.error("El DNI debe tener exactamente 8 dígitos numéricos");
      return;
    }

    try {
      setIsSearching(true);
      const res = await Api.get(`/persona/dni/${searchDni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.body) {
        toast.success("Persona encontrada en el sistema");
        setSelectedPersona(res.data.body);
        setIsModalOpen(false);
      } else {
        toast.info("La persona no existe. Por favor, complete el registro.");
        setFormPhase("register");
        reset({
          dni: searchDni,
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "PERUANA",
          direccion: {
            personaId: 0,
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
        setValue("dni", searchDni);
      }
    } catch (err: unknown) {
      const error = err as AxiosError;

      if (error.response?.status === 404) {
        toast.info("La persona no existe. Por favor, complete el registro.");
        setFormPhase("register");
        reset({
          dni: searchDni,
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "PERUANA",
          direccion: {
            personaId: 0,
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
        setValue("dni", searchDni);
      } else {
        toast.error("Error al buscar la persona por DNI");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Create persona mutation
  const { mutate: createPersona, isPending: isCreating } = useMutation({
    mutationFn: async (formData: PersonaFormType) => {
      const res = await Api.post("/persona", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data as ApiResponse<PersonaData>;
    },
    onSuccess: (data) => {
      toast.success("Persona registrada y seleccionada con éxito");
      setSelectedPersona(data.body);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la persona");
    },
  });


  const onSubmitRegister = (formData: PersonaFormType) => {
    createPersona(formData);
  };

  // Create TPersona mutation
  const { mutate: createTPersona, isPending: isCreatingTPersona } = useMutation({
    mutationFn: async (tPersonaData: CreateTPersonaInput) => {
      const res = await Api.post("/t-persona", tPersonaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("T-Registro guardado con éxito");
    },
    onError: () => {
      toast.error("Error al guardar el T-Registro");
    },
  });

  const isBlocking = !selectedPersona;

  return {
    selectedPersona,
    setSelectedPersona,
    isModalOpen,
    setIsModalOpen,
    formPhase,
    setFormPhase,
    searchDni,
    setSearchDni,
    isSearching,
    isDireccionModalOpen,
    setIsDireccionModalOpen,
    activeTab,
    setActiveTab,
    categoria,
    setCategoria,
    methods,
    handleOpenSearch,
    handleSearch,
    isCreating,
    onSubmitRegister,
    isBlocking,
    createTPersona,
    isCreatingTPersona,
    companyId,
    telefono,
    setTelefono,
    email,
    setEmail,
    isAddAddressModalOpen,
    setIsAddAddressModalOpen,
  };
}
