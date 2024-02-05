import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { matter } from "~/components/fonts";
import {
  Add,
  Analytics,
  ArrowTopRight,
  Chat,
  ChevronDown,
  Explore,
  Home,
  Members,
  Money,
  Post,
  Profile,
  Settings,
  Views,
} from "~/components/icons";
import { Button } from "~/components/ui/button";
import { OverviewCard } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { cn, parseJwt } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "~/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/router";

const CreatorDashboard = () => {
  const [user, setUser] = useState<string>();
  const [wallet, setWallet] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setUser(parseJwt(getAuthToken())?.username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setWallet(parseJwt(getAuthToken())?.verified_account?.address);
  }, []);

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
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
            >
              <Home size={20} />
              Dashboard
            </Button>
            <Collapsible>
              <div className="flex items-center justify-between">
                <Button
                  variant={
                    router.pathname === "/creator/posts" ? "default" : "ghost"
                  }
                  className={`flex w-full items-center justify-start gap-2`}
                >
                  <Post size={20} />
                  Posts
                </Button>
                <CollapsibleTrigger>
                  <ChevronDown size={20} />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <Button
                  variant={
                    router.pathname === "/creator/posts/drafts"
                      ? "default"
                      : "ghost"
                  }
                  className={`flex w-full items-center justify-start gap-2`}
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
            >
              <Members size={20} />
              Members
            </Button>
            <Button
              variant={
                router.pathname === "/creator/chat" ? "default" : "ghost"
              }
              className={`flex items-center justify-start gap-2`}
            >
              <Chat size={20} />
              Chat
            </Button>
            <Button
              variant={
                router.pathname === "/creator/settings" ? "default" : "ghost"
              }
              className={`flex items-center justify-start gap-2`}
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
          <Button variant={"outline"} size={"icon"}>
            <Settings />
          </Button>
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[28px]">
            Creator Dashboard
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Explore />
              Visit site
              <ArrowTopRight />
            </Button>
            <Button>
              <Add />
              Create
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <span className="text-secondary-foreground">
              <Analytics />
            </span>
            Overview
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <OverviewCard
            title={"Subscriptions"}
            data={"69K"}
            variant={"success"}
            badge={"+420%"}
            icon={<Members />}
          />
          <OverviewCard
            title={"Views"}
            data={"4.2M"}
            variant={"success"}
            badge={"+69%"}
            icon={<Views />}
          />
          <OverviewCard
            title={"Revenue"}
            data={"$420K"}
            variant={"destructive"}
            badge={"-4.2%"}
            icon={<Money />}
          />
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="text-lg font-medium">Recent Posts</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Post</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill("post")
                  .map(() => (
                    <TableRow key={Math.random() * 100}>
                      <TableCell className="font-medium">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="">
            <div className="text-lg font-medium">Drafts</div>
            <div className="flex flex-col gap-2 pt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatorDashboard;
