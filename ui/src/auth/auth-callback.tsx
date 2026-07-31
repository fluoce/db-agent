import { FluoceAuthFlow } from "@fluoce/auth-react";
import { useSearchParams } from "react-router-dom";
import { route } from "../const/route";
import { PageSpinner } from "@/components/page-spinner";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  return (
    <FluoceAuthFlow
      code={code!}
      redirect={route.agent.base}
      fallback={<PageSpinner />}
    />
  );
};

export default AuthCallback;
