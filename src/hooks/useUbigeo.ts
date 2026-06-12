import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import {
  UbigeoDepartamento,
  UbigeoProvincia,
  UbigeoDistrito,
  ApiResponse,
} from "@/interface/response.interface";

export function useUbigeo(selectedDeptoId?: number, selectedProvId?: number) {
  const { token } = useAuth();

  // Load Departamentos
  const { data: deptosData, isLoading: isLoadingDeptos } = useQuery<
    ApiResponse<UbigeoDepartamento[]>
  >({
    queryKey: ["departamentos", token],
    queryFn: async () => {
      const res = await Api.get("/ubigeo/departamentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: Infinity,
  });

  // Load Provincias when depto changes
  const { data: provsData, isLoading: isLoadingProvs } = useQuery<
    ApiResponse<UbigeoProvincia[]>
  >({
    queryKey: ["provincias", selectedDeptoId, token],
    queryFn: async () => {
      if (!selectedDeptoId) return { message: "", body: [], status: 200 };
      console.log("se ejecutó provincias");
      const res = await Api.get(`/ubigeo/provincias/${selectedDeptoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !!selectedDeptoId && selectedDeptoId > 0,
    staleTime: Infinity,
  });

  // Load Distritos when prov changes
  const { data: distsData, isLoading: isLoadingDists } = useQuery<
    ApiResponse<UbigeoDistrito[]>
  >({
    queryKey: ["distritos", selectedProvId, token],
    queryFn: async () => {
      if (!selectedProvId) return { message: "", body: [], status: 200 };
      const res = await Api.get(`/ubigeo/distritos/${selectedProvId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !!selectedProvId && selectedProvId > 0,
    staleTime: Infinity,
  });

  const departamentos = deptosData?.body || [];
  const provincias =
    selectedDeptoId && selectedDeptoId > 0 ? provsData?.body || [] : [];
  const distritos =
    selectedProvId && selectedProvId > 0 ? distsData?.body || [] : [];

  return {
    departamentos,
    provincias,
    distritos,
    isLoadingDeptos,
    isLoadingProvs,
    isLoadingDists,
  };
}
