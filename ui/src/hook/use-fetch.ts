import { useCallback } from "react";
import { env } from "@/const/env";
import { useFluoceAuth } from "@fluoce/auth-react";

interface UseFetchProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  header?: Record<string, string>;
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export function useFetch() {
  const { access_token, refresh } = useFluoceAuth();

  const request = useCallback(
    async ({ endpoint, method, body, header }: UseFetchProps): Promise<any> => {
      const makeRequest = async () => {
        return fetch(`${env.backendUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(header ?? {}),
            ...(access_token
              ? {
                  Authorization: `Bearer ${access_token}`,
                }
              : {}),
          },
          ...(body !== undefined && {
            body: JSON.stringify(body),
          }),
        });
      };

      let response = await makeRequest();

      if (response.status !== 401) {
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message ?? "Request failed");
        }

        return response.json();
      }

      if (!isRefreshing) {
        isRefreshing = true;
        //@ts-ignore
        refreshPromise = refresh().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });

        await refreshPromise;
      }

      await refreshPromise;

      response = await makeRequest();

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "Request failed");
      }

      return response.json();
    },
    [access_token],
  );

  return request;
}
