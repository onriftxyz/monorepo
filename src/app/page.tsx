import Link from "next/link";
import { matter, signifier } from "./_components/fonts";

export default async function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col selection:bg-black selection:text-white ${matter.className}`}
    >
      <nav className="flex items-center justify-between px-24 py-8 text-lg font-medium">
        <div className="text-2xl font-semibold">Echo</div>
        <div className="flex items-center gap-8">
          <div>How?</div>
          <div>Read</div>
          <Link
            href="/onboard"
            className="rounded-full bg-cyan-300 px-4 py-2 transition duration-200 ease-in-out hover:bg-cyan-400"
          >
            Write &rarr;
          </Link>
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
