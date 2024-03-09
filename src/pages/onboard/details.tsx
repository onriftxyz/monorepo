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
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import Layout from "./layout";

const OnboardingSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(200),
  url: z.string().url(),
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
    <Layout>
      <main className={``}>
        {/*  */}
        <div className="flex flex-col items-center justify-center gap-4 px-40 py-12">
          <Form {...onboardingForm}>
            <form
              onSubmit={onboardingForm.handleSubmit(onSubmit)}
              className="flex w-[392px] flex-col gap-6"
            >
              <FormField
                control={onboardingForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name<span className="text-accent">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name here" />
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
                    <FormLabel>
                      Bio<span className="text-accent">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Placeholder text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={onboardingForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL<span className="text-accent">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="px-3 py-[7px] text- bg-transparent text-sm border border-input rounded-md rounded-r-none">
                          https://
                        </span>
                        <Input
                          {...field}
                          placeholder="www.example.com"
                          className="flex-1 rounded-l-none"
                        />
                      </div>
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
