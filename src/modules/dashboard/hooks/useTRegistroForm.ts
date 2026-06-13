import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import type {
  ApiResponse,
  PersonaData,
  EmpresaData,
} from "@/interface/response.interface";
import {
  personaSchema,
  type PersonaFormType,
} from "../../admin/schemas/persona.schema";
import { formatDireccion } from "@/utils/address";

export type CategoriaType =
  | "TRABAJADOR"
  | "PENSIONISTA"
  | "PERSONAL_FORMACION_LABORAL"
  | "PERSONAL_TERCERO";

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

export interface TRegistroSuccessData {
  empleador: {
    ruc: string;
    name: string;
    direccion: string;
  };
  trabajador: {
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    sexo: string;
    estadoCivil: string;
    nacionalidad: string;
    telefono: string;
    email: string;
    direccion: string;
  };
  laborales: {
    fechaInicio: string;
    tipoTrabajador: string;
    regimenLaboral: string;
    ocupacion: string;
    tipoContrato: string;
    tipoPago: string;
    periodoIngreso: string;
    montoRemuneracion: number;
    codlocal: string;
    discapacidad: boolean;
    sindicalizado: boolean;
    jornadaLaboral: string;
    situacionEspecial: string;
  };
  seguridadSocial: {
    regimenSalud: string;
    fechaInicioSalud: string;
    fechaFinSalud?: string;
    regimenPensionario: string;
    fechaInicioPensionario: string;
    fechaFinPensionario?: string;
    CUSPP?: string;
    sctr: boolean;
    pension?: string;
    salud?: string;
    fechaInicioSaludPension?: string;
    fechaFinSaludPension?: string;
  };
  educacion: {
    situacionEducativa: string;
    estudios: EstudiosInput[];
  };
  adicionales: {
    quintaCategoriaExonerada: boolean;
    evitaDobleImposicion: boolean;
  };
  categoria: CategoriaType;
  tPersonaId?: number;
  createAt?: string;
}

export interface ExtendedFormValues extends PersonaFormType {
  ocupacionNombre?: string;
  situacionEducativaNombre?: string;
}

export function useTRegistroForm() {
  const { token, companyId } = useAuth();

  const { data: companiesResponse } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["public-companies", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !!companyId,
  });

  const activeCompany = companiesResponse?.body?.find(
    (c) => c.companyId === companyId,
  );

  const [selectedPersona, setSelectedPersona] = useState<
    PersonaData | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formPhase, setFormPhase] = useState<"search" | "register">("search");
  const [searchDni, setSearchDni] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<
    "resumen" | "trabajador" | "pensionista" | "formacion"
  >("resumen");

  // Radio button category selection inside Resumen de Prestadores
  const [categoria, setCategoria] = useState<CategoriaType>("TRABAJADOR");

  // Phone and Email state for TPersona
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Success data state
  const [successData, setSuccessData] = useState<TRegistroSuccessData | null>(
    null,
  );

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
      const { direccion: { personaId, ...direccionRest }, ...personaRest } = formData;
      const payload = {
        ...personaRest,
        direccion: direccionRest,
      };

      const res = await Api.post("/persona", payload, {
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
  const { mutate: createTPersona, isPending: isCreatingTPersona } = useMutation(
    {
      mutationFn: async (tPersonaData: CreateTPersonaInput) => {
        const res = await Api.post("/t-persona", tPersonaData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      },
      onSuccess: (data, variables) => {
        toast.success("T-Registro guardado con éxito");
        if (selectedPersona && activeCompany) {
          const formValues = methods.getValues() as ExtendedFormValues;
          const principalAddress =
            selectedPersona.direcciones &&
            selectedPersona.direcciones.length > 0
              ? formatDireccion(selectedPersona.direcciones[0])
              : "No registrada";

          setSuccessData({
            tPersonaId: data?.body?.tPersonaId,
            createAt: data?.body?.createAt,
            empleador: {
              ruc: activeCompany.ruc,
              name: activeCompany.name,
              direccion: activeCompany.address,
            },
            trabajador: {
              dni: selectedPersona.dni,
              nombres: selectedPersona.nombres,
              apellidoPaterno: selectedPersona.apellidoPaterno,
              apellidoMaterno: selectedPersona.apellidoMaterno,
              fechaNacimiento: selectedPersona.fechaNacimiento,
              sexo: selectedPersona.sexo,
              estadoCivil: selectedPersona.estadoCivil,
              nacionalidad: selectedPersona.nacionalidad,
              telefono: variables.telefono || "",
              email: variables.email || "",
              direccion: principalAddress,
            },
            laborales: {
              fechaInicio: variables.fechaInicio || "",
              tipoTrabajador: variables.tipoTrabajador || "EMPLEADO",
              regimenLaboral: variables.regimenLaboral || "D_LEG_728",
              ocupacion:
                formValues.ocupacionNombre || "OCUPACION NO ESPECIFICADA",
              tipoContrato: variables.tipoContrato || "PLAZO_INDETERMINADO",
              tipoPago: variables.tipoPago || "EFECTIVO",
              periodoIngreso: variables.periodoIngreso || "MENSUAL",
              montoRemuneracion: variables.montoRemuneracionInicial || 0,
              codlocal: variables.codlocal || "0000",
              discapacidad: variables.discapacidad || false,
              sindicalizado: variables.sindicalizado || false,
              jornadaLaboral: variables.jornadaLaboral || "MAXIMA",
              situacionEspecial: variables.situacionEspecial || "NINGUNA",
            },
            seguridadSocial: {
              regimenSalud: variables.regimenSalud || "ESSALUD_REGULAR",
              fechaInicioSalud: variables.fechaInicioSalud || "",
              fechaFinSalud: variables.fechaFinSalud,
              regimenPensionario:
                variables.regimenPensionario || "SIN_REGIMEN_PENSIONARIO",
              fechaInicioPensionario: variables.fechaInicioPensionario || "",
              fechaFinPensionario: variables.fechaFinPensionario,
              CUSPP: variables.CUSPP,
              sctr: variables.sctr || false,
              pension: variables.pension,
              salud: variables.salud,
              fechaInicioSaludPension: variables.fechaInicioSaludPension,
              fechaFinSaludPension: variables.fechaFinSaludPension,
            },
            educacion: {
              situacionEducativa:
                formValues.situacionEducativaNombre || "SIN ESTUDIOS",
              estudios: variables.estudios || [],
            },
            adicionales: {
              quintaCategoriaExonerada:
                variables.quintaCategoriaExonerada || false,
              evitaDobleImposicion: variables.evitaDobleImposicion || false,
            },
            categoria: categoria,
          });
        }
      },
      onError: () => {
        toast.error("Error al guardar el T-Registro");
      },
    },
  );

  // Update TPersona mutation
  const { mutate: updateTPersona, isPending: isUpdatingTPersona } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateTPersonaInput }) => {
      const res = await Api.patch(`/t-persona/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("T-Registro actualizado con éxito");
    },
    onError: () => {
      toast.error("Error al actualizar el T-Registro");
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
    updateTPersona,
    isUpdatingTPersona,
    companyId,
    telefono,
    setTelefono,
    email,
    setEmail,
    isAddAddressModalOpen,
    setIsAddAddressModalOpen,
    successData,
    setSuccessData,
  };
}
