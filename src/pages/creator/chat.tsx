import { matter } from "~/components/fonts";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { cn } from "~/lib/utils";
import { ChatSidebar } from "~/components/chat/sidebar";
import { useAuthenticated } from "~/lib/useAuthenticated";

const Members = () => {
  useAuthenticated();

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col px-8 pt-5">
        <CreatorTopNav title="Chat" />
        <div className="grid grid-cols-3 gap-4 divide-x-[1px] divide-muted pt-5">
          <ChatSidebar />
          <div className="col-span-2"></div>
        </div>
      </div>
    </main>
  );
};

export default Members;
