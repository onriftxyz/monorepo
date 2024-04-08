import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { matter } from "~/components/fonts";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { ImageUpload } from "~/components/onboarding";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { PaymentsSettingsSchema, ProfileSettingsSchema } from "~/utils/forms";
import { validateAddress } from "~/utils/solana";

const Settings = () => {
  useAuthenticated();

  const { data: user } = api.user.get.useQuery();
  const { mutateAsync: update } = api.user.update.useMutation();
  const { mutateAsync: uploadAvatar } =
    api.upload.getAvatarSignedUrl.useMutation();

  const settingsForm = useForm<z.infer<typeof ProfileSettingsSchema>>({
    resolver: zodResolver(ProfileSettingsSchema),
  });
  const paymentSettingsForm = useForm<z.infer<typeof PaymentsSettingsSchema>>({
    resolver: zodResolver(PaymentsSettingsSchema),
  });

  useEffect(() => {
    if (user) {
      settingsForm.setValue("name", user.profile.name!);
      settingsForm.setValue("username", user.profile.username!);
      settingsForm.setValue("bio", user.profile.bio!);
      settingsForm.setValue("twitter", user.profile.twitter!);
      settingsForm.setValue("avatar", user.profile.avatar!);
      paymentSettingsForm.setValue("wallet", user.profile.wallet!);
    }
  }, [user, settingsForm, paymentSettingsForm]);

  useEffect(() => {
    const { unsubscribe } = settingsForm.watch((data) => {
      if (data.avatar) {
        try {
          uploadAvatar()
            .then((signedUrl) =>
              fetch(signedUrl, {
                method: "PUT",
                body: data.avatar,
                headers: {
                  "Content-Type": data.avatar!.type,
                },
              })
                .then(() => {
                  console.log(data.avatar, user?.user?.id);

                  update({
                    name: data.name,
                    bio: data.bio,
                    username: data.username,
                    twitter: data.twitter,
                    avatar: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/users/${user?.user?.id}`,
                  })
                    .then(() => {
                      toast({ title: "Profile settings updated!" });
                      return;
                    })
                    .catch(() => {
                      toast({
                        title: "Could not save new profile settings!",
                        variant: "destructive",
                      });
                      return;
                    });
                })
                .catch(() => {
                  toast({
                    title: "Could not save new profile settings!",
                    variant: "destructive",
                  });
                }),
            )
            .catch(() => {
              toast({
                title: "Could not save new profile settings!",
                variant: "destructive",
              });
            });
        } catch (e) {
          console.log("Error when uploading avatar", e);
          return;
        }
      }

      console.log(data.avatar);

      update({
        name: data.name,
        bio: data.bio,
        username: data.username,
        twitter: data.twitter,
        avatar: "",
      })
        .then(() => {
          toast({ title: "Profile settings updated!" });
        })
        .catch(() => {
          toast({
            title: "Could not save new profile settings!",
            variant: "destructive",
          });
        });
    });

    const { unsubscribe: unsubscribePayments } = paymentSettingsForm.watch(
      (data) => {
        if (validateAddress(data.wallet!)) {
          update({
            wallet: data.wallet,
          })
            .then(() => {
              toast({ title: "Payment settings updated!" });
            })
            .catch(() => {
              toast({
                title: "Could not save new payment settings!",
                variant: "destructive",
              });
            });
        } else
          toast({
            title: "Invalid solana address!",
            variant: "destructive",
          });
      },
    );

    return () => {
      unsubscribe();
      unsubscribePayments();
    };
  }, [settingsForm, paymentSettingsForm, update]);

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Settings" />
        <Tabs defaultValue="profile" className="px-80 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="products" disabled>
              Products
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Form {...settingsForm}>
              <form className="flex w-full flex-col gap-6 py-8">
                <div className="flex justify-center">
                  <ImageUpload
                    form={settingsForm}
                    defaultAvatar={
                      user?.profile.avatar ||
                      "https://placehold.co/256/333/777.webp?text=PFP"
                    }
                  />
                </div>
                <FormField
                  control={settingsForm.control}
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
                  control={settingsForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="gap-4">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="_anatoly" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
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
                  control={settingsForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <div className="flex w-full items-center">
                        <Input
                          placeholder="twitter.com/"
                          className="pointer-events-none w-fit cursor-not-allowed rounded-r-none"
                          disabled
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
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="payments">
            <Form {...paymentSettingsForm}>
              <form className="flex w-full flex-col gap-6 py-8">
                <FormField
                  control={paymentSettingsForm.control}
                  name="wallet"
                  render={({ field }) => (
                    <FormItem className="gap-4">
                      <FormLabel>Wallet</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0oABcdEfffGHIJkLmn1oPQ2RSTuvW3XYzabCDE4FG567"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="products" className="py-6 text-center">
            Coming soon
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Settings;
