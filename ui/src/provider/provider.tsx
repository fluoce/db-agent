import type { ReactNode } from "react";
import { TanstackProvider } from "./tanstack/tanstack-provider";
import { FluoceAuthProvider } from "@fluoce/auth-react";
import { BrowserRouter } from "react-router-dom";
import { env } from "@/const/env";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
      <BrowserRouter>
        <FluoceAuthProvider app_url={env.appUrl}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </FluoceAuthProvider>
      </BrowserRouter>
    </TanstackProvider>
  );
}
