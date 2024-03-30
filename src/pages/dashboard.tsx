import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { matter } from "~/components/fonts";
import {
  Chat,
  Explore,
  Home,
  Notifications,
  Profile,
  Settings,
} from "~/components/icons";
import { Button } from "~/components/ui/button";
import { BadgeInput } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn, parseJwt } from "~/lib/utils";
import { api } from "~/utils/api";

const Dashboard = () => {
  const [user, setUser] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();

  const getAllProducts = api.product.getAll.useQuery({ limit: 10, offset: 0 });
  console.log(getAllProducts);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setUser(parseJwt(getAuthToken())?.username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setUserEmail(parseJwt(getAuthToken())?.email);
  }, []);

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <div className="flex flex-col justify-between gap-4 px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Rift</div>
          <BadgeInput placeholder="Search..." />
          <div className="flex flex-col gap-2 font-medium text-muted-foreground">
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Home />
              Home
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled
                    className={`flex items-center justify-start gap-2 disabled:cursor-not-allowed`}
                  >
                    <Chat />
                    Chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Talk to your favorite creators!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex w-full items-center justify-start gap-2`}
                >
                  <Notifications />
                  Notifications
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>
                    Recent activity around creators you follow.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 pt-4">
                  {Array(15)
                    .fill("notifcation")
                    .map(() => (
                      <div
                        key={Math.random() * 100}
                        className="flex items-center space-x-4"
                      >
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Explore />
              Explore
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Profile />
              Profile
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span>{user}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {userEmail}
            </span>
          </div>
          <Button variant={"outline"} size={"icon"}>
            <Settings />
          </Button>
        </div>
      </div>
      <div className="col-span-4"></div>
    </main>
  );
};

export default Dashboard;
