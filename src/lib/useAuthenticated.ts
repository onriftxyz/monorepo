import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export const useAuthenticated = () => {
  const dynamic = useDynamicContext();
  const router = useRouter();

  const { data } = api.user.get.useQuery();

  useEffect(() => {
    if (data) {
      if (data?.user?.onboarded && router.pathname !== "/creator") {
        void router.push("/creator");
      } else if (!data?.user?.onboarded && router.pathname !== "/onboard") {
        void router.push("/onboard");
      }
    } else if (router.pathname !== "/") {
      void router.push("/");
    }
  }, [dynamic, router, data]);
};
