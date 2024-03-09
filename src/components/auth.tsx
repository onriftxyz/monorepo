import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
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
import { useConnectWithEmailOtp } from "@dynamic-labs/sdk-react-core";

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

  const { connectWithEmail, verifyOneTimePassword } = useConnectWithEmailOtp();

  const authForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: z.infer<typeof AuthSchema>) => {
    if (step === 0) {
      await connectWithEmail(data.email);
      setStep(step + 1);
    } else {
      verifyOneTimePassword(data.otp!)
        .then(() =>
          authForm.setError("otp", {
            type: "validate",
            message: "You seem to check out!",
          }),
        )
        .catch(() =>
          authForm.setError("otp", {
            type: "validate",
            message: "Double check your verification code!",
          }),
        );
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
              <Button type="submit">
                {step === 0 ? "Continue" : "Verify"} &rarr;
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
