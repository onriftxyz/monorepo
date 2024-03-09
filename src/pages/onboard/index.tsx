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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { Apple, Google, Twitter } from "~/components/icons";
import Image from "next/image";
import Layout from "./layout";

const OnboardingSchema = z.object({
  email: z.string().email(),
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

    // Only just when its new user
    router.push("/onboard/details");

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
    <Layout>
      <main className={``}>
        {/*  */}
        <div className="flex flex-col items-center justify-center gap-4 px-40 py-12">
          <div className="text-xl font-medium leading-none">Join Rift</div>
          <div className="text-sm leading-none">
            Sign in using Google, or your Email address.
          </div>
          <div className="flex w-full items-center gap-3">
            <Button variant={"outline"} className="w-full">
              <Google />
            </Button>
            <Button variant={"outline"} className="w-full">
              <Apple />
            </Button>
            <Button variant={"outline"} className="w-full">
              <Twitter />
            </Button>
          </div>
          <div className="flex w-full items-center gap-3 text-sm text-muted-foreground">
            <Separator className="shrink" />
            <div>OR</div>
            <Separator className="shrink" />
          </div>
          <Form {...onboardingForm}>
            <form
              onSubmit={onboardingForm.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-6"
            >
              <FormField
                control={onboardingForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-accent">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="anatoly@solana.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Get Started &rarr;</Button>
            </form>
          </Form>
        </div>
      </main>
    </Layout>
  );
}
