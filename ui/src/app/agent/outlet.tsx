import { ActionBar } from "@/components/action-bar";
import { Outlet } from "react-router-dom";

export function AgentOutlet() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-background sticky top-0 z-20">
        <ActionBar />
      </div>
      <Outlet />
    </div>
  );
}
