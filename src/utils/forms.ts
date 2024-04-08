import { z, type ZodCustomIssue } from "zod";
import { toast } from "~/components/ui/use-toast";
import { validateAddress } from "./solana";

export const OnboardingSchema = z.object({
  name: z
    .string({ required_error: "We won't sell your data!" })
    .min(2, "Try something longer?"),
  bio: z.string().max(200, "Try keeping it under 200.").optional(),
  twitter: z.string().optional(),
  username: z
    .string({ required_error: "We won't sell your data!" })
    .min(3, "Try something longer?")
    .refine(
      (un) =>
        ![
          "creator",
          "404",
          "checkout",
          "home",
          "index",
          "onboard",
          "products",
        ].includes(un),
      "Username is already taken.",
    ),
  avatar: z
    .custom<File>()
    .optional()
    // These errors are handled in the ImageUpload component already,
    // and displays toasts for the same, but still they are in the schema just in case,
    // someone bypasses the client restrictions
    // BUG: THIS refine is causing some bug @pybash
    // .refine(
    //   (f) => f?.type.startsWith("image/"),
    //   () => {
    //     toast({ title: "Try selecting an image", variant: "destructive" });
    //     return "Try selecting an image" as unknown as ZodCustomIssue;
    //   },
    // )
    .refine(
      (f) => (f?.size ?? 0) <= 10000000,
      () => {
        toast({ title: "Your image is too big", variant: "destructive" });
        return "Your image is too big" as unknown as ZodCustomIssue;
      },
    ),
});

export const ProfileSettingsSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .min(2, "Try something longer?"),
  bio: z.string().max(200, "Try keeping it under 200.").optional(),
  twitter: z.string().optional(),
  username: z
    .string({ required_error: "Username is required!" })
    .min(3, "Try something longer?")
    .refine(
      (un) =>
        ![
          "creator",
          "404",
          "checkout",
          "home",
          "index",
          "onboard",
          "products",
          "settings",
        ].includes(un),
      "Username is already taken.",
    ),
  avatar: z
    .custom<File>()
    .optional()
    // These errors are handled in the ImageUpload component already,
    // and displays toasts for the same, but still they are in the schema just in case,
    // someone bypasses the client restrictions
    // BUG: THIS refine is causing some bug @pybash
    // .refine(
    //   (f) => f?.type.startsWith("image/"),
    //   () => {
    //     toast({ title: "Try selecting an image", variant: "destructive" });
    //     return "Try selecting an image" as unknown as ZodCustomIssue;
    //   },
    // )
    .refine(
      (f) => (f?.size ?? 0) <= 10000000,
      () => {
        toast({ title: "Your image is too big", variant: "destructive" });
        return "Your image is too big" as unknown as ZodCustomIssue;
      },
    ),
});

export const PaymentsSettingsSchema = z.object({
  wallet: z.string().refine((addr) => validateAddress(addr)),
});
