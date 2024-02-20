import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { matter, signifier } from "~/components/fonts";
import { OnboardingButton } from "~/components/onboarding";

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
      className={`flex min-h-screen flex-col selection:bg-black selection:text-white ${matter.className}`}
    >
      <nav className="flex items-center justify-between px-24 py-8 text-lg font-medium">
        <div className="text-2xl font-semibold">Echo</div>
        <div className="flex items-center gap-8">
          <div>How?</div>
          <div>Read</div>
          <OnboardingButton />
        </div>
      </nav>
      <div className="flex items-center justify-center bg-black py-56 text-8xl text-white selection:bg-white selection:text-black">
        Read. Write.
        <span className={`pl-2 italic text-cyan-300 ${signifier.className}`}>
          Own
        </span>
        .
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-10 bg-cyan-300 px-16 py-36 text-center text-7xl">
          More than just publishing.
          <span className="text-base">
            A community of creators, and audiences <br />
            in a seamless new economy.
          </span>
        </div>
        <div className="flex flex-col gap-10 px-16 py-36 text-center text-7xl">
          Distractionless writing.
          <span className="text-base">
            Frictionless publishing. Seamless reading.
            <br />
            Total ownership.
          </span>
        </div>
      </div>
      <Link
        href="/onboard"
        className="flex items-center justify-center bg-teal-600 px-24 py-24 text-5xl text-white transition duration-200 ease-in-out hover:bg-green-300 hover:text-black"
      >
        Start Writing &rarr;
      </Link>
    </main>
  );
}
