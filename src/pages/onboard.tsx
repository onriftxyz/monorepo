import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { v4 } from "uuid";
import type { V4Options } from "uuid";

const OnboardingSchema = z.object({
  name: z.string(),
  pfp: z.string().url(),
  about: z.string(),
  username: z.string().refine((s) => !s.includes(" "), "No Spaces!"),
});

export default function Home() {
  const dynamic = useDynamicContext();
  const router = useRouter();

  const onboardingForm = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      username: "",
      pfp: "https://randomuser.me/api/portraits/lego/4.jpg",
      about: "",
    },
  });

  const onSubmit = (data: z.infer<typeof OnboardingSchema>) => {
    toast({
      title: "Fake onboarding you...",
    });
  };

  useEffect(() => {
    if (!dynamic.user?.newUser && dynamic.isAuthenticated) {
      void router.push("/creator");
    } else if (!dynamic.isAuthenticated) {
      void router.push("/");
    }
  }, [dynamic]);

  return (
    <main
      className={`grid min-h-screen grid-cols-2 selection:bg-white selection:text-black ${matter.className}`}
    >
      <div className="flex flex-col px-48 py-12">
        <div className="pb-28 text-xl font-medium">Rift</div>
        <div className="text-3xl font-medium">Sign in</div>
        <div className="text-sm text-secondary-foreground">
          Start growing your audience sustainably.
        </div>
        <Form {...onboardingForm}>
          <form
            onSubmit={onboardingForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 pt-6"
          >
            <FormField
              control={onboardingForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="anatoly@solana.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="anatoly@solana.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={onboardingForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="anatoly@solana.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="bg-white text-black transition duration-200 ease-in-out hover:bg-white/80"
              type="submit"
              variant="secondary"
            >
              Let&apos;s go &rarr;
            </Button>
          </form>
        </Form>
        <div className="flex max-w-full items-center gap-2 overflow-hidden py-4 text-muted-foreground">
          <Separator className="shrink" />
          or <Separator className="shrink" />
        </div>
        <Button
          className="bg-white text-black transition duration-200 ease-in-out hover:bg-white/80"
          type="submit"
          variant="secondary"
        >
          Sign in with Google
        </Button>
        <div className="flex max-w-full items-center gap-2 overflow-hidden py-4 text-muted-foreground">
          <Separator className="shrink" />
          or <Separator className="shrink" />
        </div>
        <Button type="submit" variant="outline">
          Connect a wallet
        </Button>
      </div>
      <div className="bg-foreground"></div>
    </main>
  );
}
