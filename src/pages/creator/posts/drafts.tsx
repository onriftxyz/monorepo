import { matter } from "~/components/fonts";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
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
        <div className="flex items-center justify-between pt-4"></div>
      </div>
    </main>
  );
};

export default Drafts;
