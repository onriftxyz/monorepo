import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import Image from "next/image";
import { ImageUpload } from "~/components/onboarding";
import { api } from "~/utils/api";
import { OnboardingSchema } from "~/utils/forms";
import { env } from "~/env";

export default function Home() {
  const router = useRouter();

  const { mutateAsync: onboard } = api.user.onboard.useMutation();

  const onboardingForm = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
  });

  const signedUrlCall = api.upload.getAvatarSignedUrl.useMutation();

  const onSubmit = async ({
    name,
    twitter,
    bio,
    avatar,
  }: z.infer<typeof OnboardingSchema>) => {
    let avatarUploaded = false;

    if (avatar) {
      try {
        const signedUrl = await signedUrlCall.mutateAsync();
        await fetch(signedUrl, {
          method: "PUT",
          body: avatar,
          headers: {
            "Content-Type": avatar.type,
          },
        });
        avatarUploaded = true;
      } catch (e) {
        console.log("Error when uploading avatar", e);
        return
      }
    }

    onboard({
      name,
      twitter,
      bio,
      avatarUploaded: avatarUploaded,
    })
      .then(async () => {
        router.push("/creator");
      })
      .catch((e) => {
        console.log("Error when onboarding", e);
      });
  };

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
