import { Route, Routes } from "react-router-dom";
import { childRoute, route } from "./const/route";
import AuthCallback from "./auth/auth-callback";
import { FluoceAuthGuard } from "@fluoce/auth-react";
import { Agent, Home, AgentOutlet } from "./app";
import { PageSpinner } from "./components/page-spinner";
import { DBChat } from "./app/agent/chat/db/db-chat";

export default function Layout() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-200 px-2">
        <Routes>
          <Route path={route.base} element={<Home />} />
          <Route path={route.authCallback} element={<AuthCallback />} />
          <Route
            path={route.agent.base}
            element={
              <FluoceAuthGuard can_redirect={true} fallback={<PageSpinner />}>
                <AgentOutlet />
              </FluoceAuthGuard>
            }
          >
            <Route index element={<Agent />} />
            <Route path={childRoute.chat.db} element={<DBChat />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
