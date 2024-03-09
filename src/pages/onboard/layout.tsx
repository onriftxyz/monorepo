import { matter } from "~/components/fonts";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Apple, Google, Twitter } from "~/components/icons";
import Image from "next/image";
import { ReactNode } from "react";


interface LayoutProps {
    children?: ReactNode;
  }
  

  export default function Layout({ children }: LayoutProps) {

  return (
   
  <main
    className={`grid min-h-screen grid-cols-2 selection:bg-white selection:text-black ${matter.className} overflow-y-hidden`}
  >
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-24 text-center">
      {/* Noise & Texture Background */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-50 bg-[lightgray_0%_0%/100px_100px] bg-[url('/assets/404-noise.png')] bg-repeat opacity-20" />
      {/* Glow from Top */}
      <div className="absolute -top-[50%] left-[50%] h-[50vh] w-[50vw] -translate-x-[50%] rounded-full bg-[#E2E5FD] blur-[300px]" />
      {/* Glow from Bottom */}
      <div className="absolute -bottom-[50%] left-[50%] h-[50vh] w-[50vw] -translate-x-[50%] rounded-full bg-[#E2E5FD] blur-[300px]" />
      <Image
        src="/assets/faded-logo.png"
        width={256}
        height={256}
        alt="logo faded"
      />
      <div className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-4xl font-medium text-transparent">
        Where creators thrive, content reigns, and earnings soar.
      </div>
    </div>
    {children}
    <div className="bg-foreground"></div>
    </main>
  );
}
