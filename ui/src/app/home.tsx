import { Button } from "@/components/ui/button";
import { route } from "@/const/route";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Link tabIndex={-1} to={route.agent.base}>
        <Button>Let's Start</Button>
      </Link>
    </div>
  );
}
