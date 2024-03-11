import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { matter } from "~/components/fonts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import { ImageUpload } from "~/components/onboarding";

export const OnboardingSchema = z.object({
  name: z
    .string({ required_error: "We won't sell your data!" })
    .min(2, "Try something longer?"),
  bio: z.string().max(200, "Try keeping it under 200.").optional(),
  twitter: z.string().optional(),
  avatar: z
    .instanceof(File)
    .optional()
    // These errors are handled in the ImageUpload component already,
    // and displays toasts for the same, but still they are in the schema just in case,
    // someone bypasses the client restrictions
    .refine((f) => f?.type.startsWith("image/"), "Try selecting an image")
    .refine((f) => (f?.size ?? 0) >= 10000000, "Your image is too big"),
});

export default function Home() {
  // TODO: Do this properly
  // const dynamic = useDynamicContext();
  const router = useRouter();
  // const createUser = api.auth.create.useMutation();

  const onboardingForm = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
  });

  const onSubmit = async (data: z.infer<typeof OnboardingSchema>) => {
    // TODO: Do this properly
    // const user = await createUser.mutateAsync({
    //   ...data,
    // });

    router.push("/creator");

    // Or else push to dashboard/feed
    // router.push("/creator");
  };

  // TODO: Do this properly
  // useEffect(() => {
  //   if (!dynamic.user?.newUser && dynamic.isAuthenticated) {
  //     void router.push("/creator");
  //   } else if (!dynamic.isAuthenticated) {
  //     void router.push("/");
  //   }
  // }, [dynamic]);

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
      <div className="flex flex-col items-center justify-center gap-4 px-40 py-12">
        <Form {...onboardingForm}>
          <form
            onSubmit={onboardingForm.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <div className="flex justify-center">
              <ImageUpload form={onboardingForm} />
            </div>
            <FormField
              control={onboardingForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Anatoly" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={onboardingForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={onboardingForm.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <div className="flex w-full items-center">
                    <Input
                      placeholder="twitter.com/"
                      className="pointer-events-none w-fit cursor-not-allowed rounded-r-none"
                    />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="_soulninja"
                        className="rounded-l-none"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Continue &rarr;</Button>
          </form>
        </Form>
      </div>
      <div className="bg-foreground"></div>
    </main>
  );
}
