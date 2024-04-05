import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { matter } from "./fonts";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Loader } from "./icons";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>> | ((arg0: boolean) => void);
  children: ReactNode;
}

const AuthSchema = z.object({
  email: z
    .string({ required_error: "We won't sell your email." })
    .email("Looks like you made a typo!"),
  otp: z
    .string()
    .min(6, "You missed a couple digits!")
    .max(6, "You missed a couple digits!")
    .optional(),
});

export const AuthDialog = ({ open, onOpenChange, children }: Props) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { mutateAsync: generateOtp } = api.auth.generateOtp.useMutation();
  const { mutateAsync: verifyOtp } = api.auth.verifyOtp.useMutation();

  const authForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: z.infer<typeof AuthSchema>) => {
    if (step === 0) {
      setLoading(true);
      try {
        await generateOtp({ email: data.email });
        setStep(step + 1);
      } catch (e) {
        authForm.setError("email", {
          type: "validate",
          message: "We couldn't send you a verification code!",
        });
      }
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const { session, user } = await verifyOtp({
          email: data.email,
          token: data.otp!,
        });
        if (session?.access_token && user?.user_metadata.onboarded)
          void router.push("/home");
        if (session?.access_token && !user?.user_metadata.onboarded)
          void router.push("/onboard");
      } catch (e) {
        authForm.setError("otp", {
          type: "validate",
          message: "Double check your verification code!",
        });
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${matter.className}`}>
        <Form {...authForm}>
          <form
            onSubmit={authForm.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Get started</DialogTitle>
              <DialogDescription>
                Towards a new era of creation.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={authForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="anatoly@solana.com"
                      className="w-full"
                      disabled={step !== 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={authForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem
                  className={`flex w-full flex-col transition-all duration-300 ease-in-out ${step === 1 ? "block" : "hidden"}`}
                >
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      {...field}
                      required={false}
                      maxLength={6}
                      render={({ slots }) => (
                        <>
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}
                          </InputOTPGroup>
                        </>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {step === 0 ? "Continue" : "Verify"}{" "}
                {loading ? (
                  <span className="animate-spin">
                    <Loader />
                  </span>
                ) : (
                  "→"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const AuthDrawer = ({ open, onOpenChange, children }: Props) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { mutateAsync: generateOtp } = api.auth.generateOtp.useMutation();
  const { mutateAsync: verifyOtp } = api.auth.verifyOtp.useMutation();

  const authForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async ({ email, otp }: z.infer<typeof AuthSchema>) => {
    if (step === 0) {
      setLoading(true);
      await generateOtp({ email });
      setLoading(false);
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const { session, user } = await verifyOtp({ email, token: otp! });
        if (session?.access_token && user?.user_metadata.onboarded)
          void router.push("/home");
        if (session?.access_token && !user?.user_metadata.onboarded)
          void router.push("/onboard");
      } catch (e) {
        authForm.setError("otp", {
          type: "validate",
          message: "Double check your verification code!",
        });
      }
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={`sm:max-w-[425px] ${matter.className}`}>
        <Form {...authForm}>
          <form
            onSubmit={authForm.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DrawerHeader>
              <DrawerTitle>Get started</DrawerTitle>
              <DrawerDescription>
                Towards a new era of creation.
              </DrawerDescription>
            </DrawerHeader>
            <FormField
              control={authForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col px-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="anatoly@solana.com"
                      className="w-full"
                      disabled={step !== 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={authForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem
                  className={`flex w-full flex-col transition-all duration-300 ease-in-out ${step === 1 ? "block" : "hidden"}`}
                >
                  <FormLabel className="px-4">Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      {...field}
                      required={false}
                      maxLength={6}
                      render={({ slots }) => (
                        <>
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}
                          </InputOTPGroup>
                        </>
                      )}
                    />
                  </FormControl>
                  <FormMessage className="px-4" />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {step === 0 ? "Continue" : "Verify"}{" "}
                {loading ? (
                  <span className="animate-spin">
                    <Loader />
                  </span>
                ) : (
                  "→"
                )}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
