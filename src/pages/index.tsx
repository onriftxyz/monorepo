import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { AuthDialog, AuthDrawer } from "~/components/auth";
import { matter } from "~/components/fonts";
import { useAuthenticated } from "~/lib/useAuthenticated";

export default function Home() {
  useAuthenticated();

  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <main
      className={`flex min-h-screen flex-col justify-center px-8 selection:bg-background selection:text-foreground md:px-36 ${matter.className}`}
    >
      <div className="to-background/0 bg-gradient-to-b from-foreground bg-clip-text text-3xl font-medium text-transparent md:text-7xl">
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
