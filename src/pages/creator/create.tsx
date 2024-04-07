import { matter } from "~/components/fonts";
import { cn } from "~/lib/utils";
import { useRef, useState } from "react";
import { IconInput, Input } from "~/components/ui/input";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "~/components/icons";
import { useRouter } from "next/router";
import { toast } from "~/components/ui/use-toast";
import { Textarea } from "~/components/ui/textarea";

import { api } from "~/utils/api";
import { env } from "~/env";
import { Enums } from "~/server/api/supabase/types";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { validateAddress } from "~/utils/solana";

const STEP_TO_TITLE = [
  <>
    Let&apos;s get started creating
    <br />
    your shiny new product!
  </>,
  <>
    We&apos;re getting there!
    <br />
    Select your preferred format.
  </>,
  <>
    We&apos;re almost there! Add
    <br />
    contents for your customers.
  </>,
  <>
    Put a price tag and
    <br />
    we&apos;re done!
  </>,
  <>
    One last step!
    <br />
    Connect your wallet.
  </>,
];

const STEP_TO_DESC = [
  <>
    Let&apos;s start by giving this new creation a name. Your product will be
    <br />
    visible under this name everywhere on Rift. This can be changed later.
  </>,
  <>
    Choose your preferred type of format for the content you&apos;ll be sharing.
    <br /> After, the product is created you add any type of content if you
    <br />
    want.
  </>,
  <>
    More content can be added later from the dashboard. But it is recommended
    <br /> to upload atleast 1 item now. You can also skip this step if you
    want.
  </>,
  <>
    Default price for all products is free($0). This can be changed in settings.
    <br />
    Price can be changed later, however this will not affect earlier purchasers.
  </>,
  <>
    You need to do this step only the first time creating a product, if you do
    <br />
    not have a wallet address already. This wallet is the address, where
    <br />
    you&apos;ll receive all of your funds paid by your customers.
  </>,
];

const CreateProduct = () => {
  useAuthenticated();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState<Enums<"contenttype">>();
  const [content, setContent] = useState<(string | File)[]>([]);
  const [price, setPrice] = useState(0.0);
  const [wallet, setWallet] = useState<string>();

  const uploadRef = useRef<HTMLInputElement>(null);

  const { data: user } = api.user.get.useQuery();

  const createPost = api.product.create.useMutation();
  const { mutateAsync: updateWallet } = api.user.update.useMutation();
  const uploadProductFile = api.upload.getProductFileSignedUrl.useMutation();

  const uploadFile = async (folder: "uploads" | "markdown", file: File) => {
    console.log("file", file);

    const signedUrl = await uploadProductFile.mutateAsync({
      filename: file.name,
      folder: folder,
    });

    try {
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (e) {
      console.log("here");
      return "";
    }

    return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${folder}/${file.name}`;
  };

  const handleSubmit = async () => {
    if (wallet) {
      void updateWallet({ wallet });
    }

    switch (type) {
      case "LINK":
        {
          const links = content.filter(
            (c) => typeof c === "string",
          ) as string[];

          try {
            await createPost.mutateAsync({
              title: name,
              content: links,
              price: price,
              type: "LINK",
            });
          } catch (e) {
            toast({
              title: "Failed to create product",
              variant: "destructive",
            });
          }

          void router.push("/creator");
        }
        break;

      case "UPLOAD":
        {
          const files = content.filter((c) => c instanceof File) as File[];

          console.log("files", content);

          try {
            const links = await Promise.all(
              files.map((file) => {
                return uploadFile("uploads", file);
              }),
            );

            await createPost.mutateAsync({
              title: name,
              content: links,
              price: price,
              type: "UPLOAD",
            });
          } catch (e) {
            toast({
              title: "Failed to create product",
              variant: "destructive",
            });
          }
        }

        void router.push("/creator");

        break;

      case "MARKDOWN": {
        // Generate a random string
        // HACK: Find some way to have non-conflicting names
        const randomString = Math.random().toString(36).substring(7);

        const file = new File(
          [content[0] as string],
          `${randomString}_${name}.md`,
          {
            type: "text/markdown",
          },
        );

        const link = await uploadFile("markdown", file);

        try {
          await createPost.mutateAsync({
            title: name,
            content: [link],
            price: price,
            type: "MARKDOWN",
          });
        } catch (e) {
          toast({
            title: "Failed to create product",
            variant: "destructive",
          });
        }

        void router.push("/creator");
      }
    }
  };

  const router = useRouter();

  return (
    <main
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center gap-4",
        matter.className,
      )}
    >
      <Button
        className="absolute left-10 top-10"
        onClick={() => router.back()}
        variant={"outline"}
        size={"icon"}
      >
        <ArrowLeft />
      </Button>
      <Image src="/create-product.svg" alt="icon" width={131} height={90} />
      <div className="text-center text-2xl  font-medium">
        {STEP_TO_TITLE[step]}
      </div>
      <div className="text-center text-sm font-medium text-muted-foreground">
        {STEP_TO_DESC[step]}
      </div>
      {step === 0 ? (
        <div className="flex w-96 flex-col gap-4 pt-4">
          <Input
            placeholder="Content Creation Ebook"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={() => setStep(step + 1)}>Continue &rarr;</Button>
        </div>
      ) : step === 1 ? (
        <>
          <div className="flex w-1/3 flex-col gap-4 pt-4">
            <div className="flex w-full items-center justify-between rounded-lg border-2 bg-card px-4 py-3 font-medium">
              <div>
                <div>Link Content</div>
                <div className="text-xs text-muted-foreground">
                  Easiest to get started.
                </div>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={() => {
                    setType("LINK");
                    setStep(step + 1);
                  }}
                >
                  Start with this
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between rounded-lg border-2 bg-card px-4 py-3 font-medium">
              <div>
                <div>Upload Content</div>
                <div className="text-xs text-muted-foreground">
                  Downloadable items for your audience.
                </div>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={() => {
                    setType("UPLOAD");
                    setStep(step + 1);
                  }}
                >
                  Start with this
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between rounded-lg border-2 border-dashed bg-card px-4 py-3 font-medium">
              <div>
                <div>Markdown Content</div>
                <div className="text-xs text-muted-foreground">
                  Create content on Rift.
                </div>
              </div>
              <div>
                <Button
                  size="sm"
                  variant={"outline"}
                  onClick={() => {
                    setType("MARKDOWN");
                    setStep(step + 1);
                  }}
                >
                  Start with this
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : step === 2 ? (
        type === "LINK" ? (
          <div className="flex w-96 flex-col gap-4 pt-4">
            {content.length > 0 ? (
              content.map((_, ind) => (
                <Input
                  key={"link-" + ind}
                  autoFocus={ind === 0}
                  placeholder="https://yourblog.com/article"
                  value={content[ind]?.toString()}
                  onChange={(e) =>
                    setContent(
                      content.map((c, i) => (i === ind ? e.target.value : c)),
                    )
                  }
                />
              ))
            ) : (
              <Input
                placeholder="https://yourblog.com/article"
                value={content[0]?.toString()}
                onChange={(e) => setContent([e.target.value])}
              />
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setContent([...content, ""])}>
                + Add link
              </Button>
              <Button onClick={() => setStep(step + 1)}>Continue &rarr;</Button>
            </div>
          </div>
        ) : type === "UPLOAD" ? (
          <div className="flex w-96 flex-col gap-4 pt-4">
            <input
              ref={uploadRef}
              className="hidden"
              type="file"
              onChange={(e) => setContent([...content, e.target.files![0]!])}
            />
            {(content.filter((c) => c instanceof File) as File[]).map(
              (f, ind) => (
                <Input key={"file-" + ind} value={f?.name} disabled />
              ),
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => uploadRef.current?.click()}>
                + Add file
              </Button>
              <Button onClick={() => setStep(step + 1)}>Continue &rarr;</Button>
            </div>
          </div>
        ) : (
          <div className="flex w-96 flex-col gap-4 pt-4">
            <Textarea
              placeholder="# this is a heading..."
              value={content[0]?.toString()}
              onChange={(e) => setContent([e.target.value])}
            ></Textarea>
            <Button onClick={() => setStep(step + 1)}>Continue &rarr;</Button>
          </div>
        )
      ) : step === 3 ? (
        <div className="flex w-96 flex-col gap-4 pt-4">
          <IconInput
            placeholder="69.00"
            value={!!price ? price : ""}
            onChange={(e) =>
              setPrice(Number(e.target.value.replaceAll(/e|-/g, "")) ?? price)
            }
          />
          {validateAddress(user!.profile.wallet!) ? (
            <Button
              onClick={() => {
                if (price < 0)
                  toast({
                    title: "Price must be atleast $0",
                    variant: "destructive",
                  });
                else if (price > 100000)
                  toast({
                    title: "Price must be at most $100,000",
                    variant: "destructive",
                  });
                else void handleSubmit();
              }}
            >
              Complete &rarr;
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (price < 0)
                  toast({
                    title: "Price must be atleast $0",
                    variant: "destructive",
                  });
                else if (price > 100000)
                  toast({
                    title: "Price must be at most $100,000",
                    variant: "destructive",
                  });
                else setStep(step + 1);
              }}
            >
              Continue &rarr;
            </Button>
          )}
        </div>
      ) : step === 4 ? (
        <div className="flex w-96 flex-col gap-4 pt-4">
          <Input
            placeholder="0x69fku420stfu"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
          <Button
            onClick={() => {
              if (validateAddress(wallet!)) void handleSubmit();
              else
                toast({
                  title: "Address is not a valid solana address!",
                  variant: "destructive",
                });
            }}
          >
            Complete &rarr;
          </Button>
        </div>
      ) : null}
    </main>
  );
};

export default CreateProduct;
