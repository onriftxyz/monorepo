import Image from "next/image";
import { ThreeDots } from "@dynamic-labs/sdk-react-core";
import { matter } from "~/components/fonts";
import { Pencil } from "~/components/icons";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const Drafts = () => {
  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Drafts" />
        <div className="flex flex-col gap-4 rounded-lg border border-input p-4">
          {Array(6)
            .fill("published")
            .map(() => (
              <div
                key={Math.random()}
                className="flex w-full items-center gap-3.5 p-4"
              >
                <Image
                  src={`https://picsum.photos/64?random=${Math.random() * 10}`}
                  alt="post image"
                  width={64}
                  height={64}
                  className="h-12 w-12 rounded-md"
                />
                <div className="flex flex-col gap-0.5">
                  <div>
                    Random draft post title which is suffieciently long but not
                    too long.
                  </div>
                  <div className="line-clamp-1 text-sm text-secondary-foreground">
                    Random long description. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Quo sequi quas ullam. Fugiat
                    vero sed dolores officia iure quaerat, quidem ea? Saepe
                    magni quae debitis vitae totam ducimus modi provident!
                  </div>
                </div>
                <Button className="shrink-0" size={"icon"} variant="ghost">
                  <Pencil size={20} />
                </Button>
                <Button className="shrink-0" size={"icon"} variant="ghost">
                  <ThreeDots size={20} />
                </Button>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Drafts;
