import { matter } from "~/components/fonts";

const NotFound = () => {
  return (
    <main
      className={`flex h-screen flex-col items-center justify-center overflow-hidden selection:bg-black selection:text-white ${matter.className}`}
    >
      {/* Noise & Texture Background */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-50 bg-[lightgray_0%_0%/100px_100px] bg-[url('/assets/404-noise.png')] bg-repeat opacity-20"></div>
      {/* White glow from top */}
      <div className="absolute -top-[50%] left-[50%] h-[50vh] w-[50vw] -translate-x-[50%] rounded-full bg-[#E2E5FD] blur-[200px]"></div>
      <div className="flex bg-[linear-gradient(180deg,#E1E7FE_-30.67%,#09090A_103.6%)] bg-clip-text text-[20rem] font-black text-transparent drop-shadow-[0px_-6px_12px_rgba(0,0,30,0.25)]">
        40
        <div className="-scale-x-100 bg-[linear-gradient(180deg,#E1E7FE_-30.67%,#09090A_103.6%)] bg-clip-text">
          4
        </div>
      </div>
      <div className="flex bg-[linear-gradient(180deg,#E1E7FE_-30.67%,#09090A_103.6%)] bg-clip-text text-[2.5rem] text-transparent">
        &quot;This too shall pass&quot;
      </div>
    </main>
  );
};

export default NotFound;
