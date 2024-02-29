import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { matter } from "~/components/fonts";

export default function Home() {
  const dynamic = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (dynamic.isAuthenticated) {
      void router.push("/creator");
    }
  }, [dynamic]);

  return (
    <main
      className={`flex min-h-screen flex-col justify-center px-36 selection:bg-background selection:text-foreground ${matter.className}`}
    >
      <div className="to-background/0 bg-gradient-to-b from-foreground bg-clip-text text-7xl font-medium text-transparent">
        A new era of creation.
        <br />
        Coming soon on Solana.
        <DynamicWidget />
      </div>
    </main>
  );
}
