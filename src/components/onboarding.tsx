import { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { FormField, FormLabel } from "./ui/form";
import { Upload } from "./icons";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { toast } from "./ui/use-toast";
import type { OnboardingSchema } from "~/utils/forms";

interface Props {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
  defaultAvatar?: string | null;
}

export function ImageUpload({ form, defaultAvatar }: Props) {
  const [avatar, setAvatar] = useState<string | null>(defaultAvatar ?? null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const previewUpload = (file?: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string | null);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name="avatar"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Value is not required as file inputs are always uncontrolled inputs
      render={({ field: { value, onChange, ref, ...field } }) => {
        return (
          <div
            className={
              "cursor-pointer overflow-hidden rounded-full border-2 border-transparent bg-[linear-gradient(180deg,rgba(228,229,231,1)_0%,rgba(247,248,248,0.00)_100%)] bg-clip-border"
            }
            onClick={() => avatarRef.current?.click()}
          >
            <div
              className={
                "overflow-hidden rounded-full border border-[#555764] bg-background"
              }
            >
              <div
                className={
                  "overflow-hidden rounded-full border border-[#333333]"
                }
              >
                <FormLabel className="flex h-20 w-20 cursor-pointer items-center justify-center">
                  {!!avatar ? (
                    <Image src={avatar} width={112} height={112} alt="avatar" />
                  ) : (
                    <Upload />
                  )}
                </FormLabel>
                <Input
                  {...field}
                  ref={(e) => {
                    ref(e);
                    // @ts-expect-error -- This code works, but TS still complains for some reason?
                    avatarRef.current = e;
                  }}
                  onChange={(e) => {
                    if (!e.target.files![0]?.type.startsWith("image/")) {
                      toast({
                        title: "The file you selected is not an image",
                        variant: "destructive",
                      });
                      return;
                    }
                    if ((e.target.files![0]?.size ?? 0) >= 10000000) {
                      toast({
                        title: "Your file is too big!",
                        variant: "destructive",
                      });
                      return;
                    }
                    onChange(e.target.files![0]);
                    previewUpload(e.target.files![0]);
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
