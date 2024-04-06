import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export const useAuthenticated = () => {
  const { data: status, isLoading } = api.auth.isAuthenticated.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!status?.authenticated) void router.push("/");

      if (status?.authenticated && !status.onboarded)
        void router.push("/onboard");

      if (
        status?.authenticated &&
        status.onboarded &&
        (router.pathname === "/onboard" || router.pathname === "/")
      )
        void router.push("/home");
    }
  }, [isLoading, status, router]);
};
