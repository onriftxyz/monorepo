import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { AuthDialog, AuthDrawer } from "~/components/auth";
import { matter } from "~/components/fonts";

export default function Home() {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  // const dynamic = useDynamicContext();
  // const router = useRouter();

  // useEffect(() => {
  //   if (dynamic.isAuthenticated) {
  //     // @todo: check if they've finished onboarding -> if not push to onboard
  //     void router.push("/creator");
  //   }
  // }, [dynamic]);

  return (
    <main
      className={`flex min-h-screen flex-col justify-center px-36 selection:bg-background selection:text-foreground ${matter.className}`}
    >
      <div className="to-background/0 bg-gradient-to-b from-foreground bg-clip-text text-7xl font-medium text-transparent">
        A new era of creation.
        <br />
        {isDesktop ? (
          <AuthDialog open={open} onOpenChange={setOpen}>
            <button>Join in &rarr;</button>
          </AuthDialog>
        ) : (
          <AuthDrawer open={open} onOpenChange={setOpen}>
            <button>Join in &rarr;</button>
          </AuthDrawer>
        )}
        <br />
        &nbsp;
      </div>
    </main>
  );
}
