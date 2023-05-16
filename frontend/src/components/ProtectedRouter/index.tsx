import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      // Redirecionar para a página de login ou página de acesso negado.
      router.push("/");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
