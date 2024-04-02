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
    We&apos;re almost there!
    <br />
    Let&apos;s put a price tag.
  </>,
  <>
    Last step! Add some <br />
    content to complete!
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
    Default price for all products is free($0). This can be changed in settings.
    <br />
    Price can be changed later, however this will not affect earlier purchasers.
  </>,
  <>
    More content can be added later from the dashboard. But it is recommended
    <br /> to upload atleast 1 item now. You can also skip this step if you
    want.
  </>,
];

const CreateProduct = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [type, setType] = useState<"UPLOAD" | "LINKS" | "MARKDOWN">();
  const [content, setContent] = useState<(string | File)[]>([]);

  const uploadRef = useRef<HTMLInputElement>(null);

  // const createProduct = api.product.create.useMutation();

  const handleSubmit = () => {
    console.log(content);
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
      <Button className="absolute right-10 top-10" variant={"ghost"}>
        Skip
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
                    setType("LINKS");
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
        <div className="flex w-96 flex-col gap-4 pt-4">
          <IconInput
            placeholder="69.00"
            value={!!price ? price : ""}
            onChange={(e) =>
              setPrice(Number(e.target.value.replaceAll(/e|-/g, "")) ?? price)
            }
          />
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
        </div>
      ) : step === 3 ? (
        type === "LINKS" ? (
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
              <Button onClick={handleSubmit}>Complete &rarr;</Button>
            </div>
          </div>
        ) : type === "UPLOAD" ? (
          <div className="flex w-96 flex-col gap-4 pt-4">
            <input
              ref={uploadRef}
              className="hidden"
              type="file"
              onChange={(e) => setContent([...content, e.target.value])}
            />
            {content.map((_, ind) => (
              <Input
                key={"file-" + ind}
                value={content[ind]?.toString()}
                disabled
              />
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => uploadRef.current?.click()}>
                + Add file
              </Button>
              <Button>Complete &rarr;</Button>
            </div>
          </div>
        ) : (
          <div className="flex w-96 flex-col gap-4 pt-4">
            <Textarea
              placeholder="# this is a heading..."
              value={content[0]?.toString()}
              onChange={(e) => setContent([e.target.value])}
            ></Textarea>
            <Button>Complete &rarr;</Button>
          </div>
        )
      ) : null}
    </main>
  );
};

export default CreateProduct;
