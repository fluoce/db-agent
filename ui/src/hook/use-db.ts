import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "./use-fetch";
import { dbEndpoint } from "@/const/endpoint";
import type { DatabaseDtoType } from "@/types/payload-types";
import { toast } from "@/components/ui/toast";
import type { ResponseType } from "@/types/response-types";
import { dbQueryKey } from "@/const/query-key";
import type { DatabaseType } from "@/types/database-types";

export function useDBConnectionTest() {
  const f = useFetch();
  return useMutation({
    mutationFn: (body: DatabaseDtoType) =>
      f({
        endpoint: dbEndpoint.test,
        body,
        method: "POST",
      }) as Promise<
        ResponseType<{
          success: boolean;
        }>
      >,
    onSuccess: () => {},
  });
}

export function useDBConnectionSave() {
  const f = useFetch();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: DatabaseDtoType) =>
      f({
        endpoint: dbEndpoint.save,
        body,
        method: "POST",
      }) as Promise<ResponseType<{}>>,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: dbQueryKey.dbs,
      });
      toast.add({
        type: "success",
        description: data?.data?.message || "Connection saved successfully",
      });
    },
  });
}

export function useDBs() {
  const f = useFetch();
  return useQuery({
    queryKey: dbQueryKey.dbs,
    queryFn: () =>
      f({
        endpoint: dbEndpoint.base,
        method: "GET",
      }) as Promise<ResponseType<DatabaseType>>,
  });
}

export function useDBConnectionDelete() {
  const f = useFetch();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (databaseId: string) =>
      f({
        endpoint: dbEndpoint.byId(databaseId),
        method: "DELETE",
      }) as Promise<ResponseType<{}>>,
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: dbQueryKey.dbs,
      });
      toast.add({
        type: "success",
        description: data?.data?.message || "Connection deleted successfully",
      });
    },
  });
}
