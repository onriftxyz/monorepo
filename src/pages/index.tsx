import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { matter } from "~/components/fonts";

export default function Home() {
  const dynamic = useDynamicContext();
  const router = useRouter();
  const { setShowAuthFlow } = dynamic;

  useEffect(() => {
    if (dynamic.isAuthenticated) {
      // @todo: check if they've finished onboarding -> if not push to onboard
      void router.push("/creator");
    }
  }, [dynamic]);

  function loginClick() {
    setShowAuthFlow(true);
  }

  return (
    <main
      className={`flex min-h-screen flex-col justify-center px-36 selection:bg-background selection:text-foreground ${matter.className}`}
    >
      <div className="to-background/0 bg-gradient-to-b from-foreground bg-clip-text text-7xl font-medium text-transparent">
        A new era of creation.
        <br />
        <button className="mt-5" onClick={loginClick}>
          Join in
        </button>
      </div>
    </main>
  );
}
