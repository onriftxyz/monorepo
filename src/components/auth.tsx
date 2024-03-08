import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { toast } from "./ui/use-toast";
import { EmailAlreadyExistsError } from "@dynamic-labs/sdk-react-core";

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>> | ((arg0: boolean) => void);
  children: ReactNode;
}

const AuthSchema = z.object({
  email: z.string().email(),
});

const OTP = "123456";

export const AuthDialog = ({ open, onOpenChange, children }: Props) => {
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState<string>();

  const authForm = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = () => {
    if (step === 0) {
      if (!authForm.getFieldState("email").isDirty) {
        toast({
          title: "We need your email!",
          description: "looks like your forgot to put in your email.",
          variant: "destructive",
        });
      } else if (authForm.getFieldState("email").invalid) {
        toast({
          title: "You made a typo!",
          description: "Your email doesn't seem right.",
          variant: "destructive",
        });
      } else {
        setStep(step + 1);
        return;
      }
    } else {
      if (typeof otp === "undefined") return;

      if ((otp?.length ?? 0) < 6) {
        toast({
          title: "You missed a couple digits!",
          description: "The code doesn't seem complete.",
          variant: "destructive",
        });
      } else if (otp !== OTP) {
        toast({
          title: "Double check your verfication code!",
          description: "The code doesn't seem correct.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "You seem to check out!",
          description: "Let's proceed with your onboarding. Redirecting...",
        });
      }
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
                Sign up with your email or one of the social providers.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={authForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="anatoly@solana.com"
                      className="w-full"
                      disabled={step !== 0}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div
              className={`flex w-full flex-col gap-2 transition-all duration-300 ease-in-out ${step === 1 ? "block" : "hidden"}`}
            >
              <Label>Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmit();
                }}
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
            </div>
            <DialogFooter>
              <Button
                type={step === 0 ? "submit" : "button"}
                onClick={onSubmit}
              >
                {step === 0 ? "Continue" : "Verify"} &rarr;
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
