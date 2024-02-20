import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const OnboardingButton = () => {
  const router = useRouter();

  return <Button onClick={() => router.push("/onboard")}>Write &rarr;</Button>;
};
