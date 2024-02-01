import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import Head from "next/head";
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <DynamicContextProvider
      settings={{
        environmentId: "623758f3-78a6-43fc-9261-9478b74f1d19",
        walletConnectors: [SolanaWalletConnectors],
        appName: "Echo",
        shadowDOMEnabled: false,
        eventsCallbacks: {
          onAuthSuccess: () => router.push("/app"),
        },
      }}
    >
      <Head>
        <title>Echo - Read. Write. Own.</title>
      </Head>
      <Component {...pageProps} />
    </DynamicContextProvider>
  );
};

export default api.withTRPC(MyApp);
