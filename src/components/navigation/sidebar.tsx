import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/router";
import {
  Home,
  Post,
  ChevronDown,
  Members,
  Chat,
  Settings,
  ChevronRight,
} from "../icons";
import { Button } from "../ui/button";
import Image from "next/image";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { parseJwt } from "~/lib/utils";
import { useToast } from "../ui/use-toast";

export const CreatorSidebar = () => {
  const [user, setUser] = useState<string>();
  const [wallet, setWallet] = useState<string>();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setUser(parseJwt(getAuthToken())?.username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setWallet(parseJwt(getAuthToken())?.verified_account?.address);
  }, []);

  return (
    <div className="flex flex-col justify-between gap-4 px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-sm uppercase">Rift</div>
          <div className="text-xs text-secondary-foreground">
            Creator Dashboard
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 font-medium text-muted-foreground">
          <Button
            variant={router.pathname === "/creator" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator")}
          >
            <Home size={20} />
            Dashboard
          </Button>
          <Collapsible
            open={router.pathname.startsWith("/creator/posts") || open}
            onOpenChange={setOpen}
          >
            <CollapsibleTrigger className="w-full">
              <Button
                variant={
                  router.pathname === "/creator/posts" ? "default" : "ghost"
                }
                className={`flex w-full items-center justify-between gap-2`}
              >
                <div className="flex w-full items-center gap-2">
                  <Post size={20} />
                  Posts
                </div>
                <ChevronDown size={20} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Button
                variant={
                  router.pathname === "/creator/posts/drafts"
                    ? "default"
                    : "ghost"
                }
                className={`flex w-full items-center justify-start gap-2`}
                onClick={() => void router.push("/creator/posts/drafts")}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Drafts
              </Button>
              <Button
                disabled
                variant={
                  router.pathname === "/creator/posts/scheduled"
                    ? "default"
                    : "ghost"
                }
                className={`flex w-full items-center justify-start gap-2 disabled:cursor-not-allowed`}
                onClick={() => void router.push("/creator/posts/scheduled")}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scheduled
              </Button>
              <Button
                variant={
                  router.pathname === "/creator/posts/published"
                    ? "default"
                    : "ghost"
                }
                className={`flex w-full items-center justify-start gap-2`}
                onClick={() => void router.push("/creator/posts/published")}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Published
              </Button>
            </CollapsibleContent>
          </Collapsible>
          <Button
            variant={
              router.pathname === "/creator/members" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator/members")}
          >
            <Members size={20} />
            Members
          </Button>
          <Button
            variant={router.pathname === "/creator/chat" ? "default" : "ghost"}
            className={`flex items-center justify-start gap-2`}
            onClick={() => void router.push("/creator/chat")}
          >
            <Chat size={20} />
            Chat
          </Button>
          <Button
            variant={
              router.pathname === "/creator/settings" ? "default" : "ghost"
            }
            className={`flex items-center justify-start gap-2`}
            // onClick={() => void router.push("/creator/settings")}
            onClick={() =>
              toast({
                title: "Not yet implemented!",
                description: "The settings page has not yet been implemented.",
              })
            }
          >
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://picsum.photos/64"
            alt="profile photo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <span>{user}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {wallet ?? "0x000000000000"}
            </span>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() =>
            toast({
              title: "Not yet implemented!",
              description: "Profile settings have not yet been implemented!",
            })
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
