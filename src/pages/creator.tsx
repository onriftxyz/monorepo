import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { matter } from "~/components/fonts";
import {
  Add,
  Analytics,
  ArrowTopRight,
  ChevronUpDownS,
  Explore,
  Home,
  Members,
  Post,
  Profile,
  Settings,
} from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import Image from "next/image";
import { cn, parseJwt } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@radix-ui/react-select";

const CreatorDashboard = () => {
  const [user, setUser] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();

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
      <div className="flex flex-col justify-between gap-4 px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Image
              src="https://img.logoipsum.com/299.svg"
              width={42}
              height={42}
              alt="icon"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <div className="leading-4">Project 1</div>
              <div className="text-sm text-muted-foreground">
                Creator Dashboard
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 font-medium text-muted-foreground">
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Home />
              Dashboard
            </Button>
            <Collapsible>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className={`flex w-full items-center justify-start gap-2`}
                >
                  <Post />
                  Posts
                </Button>
                <CollapsibleTrigger>
                  <ChevronUpDownS />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <Button
                  variant="ghost"
                  className={`flex w-full items-center justify-start gap-2`}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Drafts
                </Button>
                <Button
                  disabled
                  variant="ghost"
                  className={`flex w-full items-center justify-start gap-2 disabled:cursor-not-allowed`}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scheduled
                </Button>
                <Button
                  variant="ghost"
                  className={`flex w-full items-center justify-start gap-2`}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Published
                </Button>
              </CollapsibleContent>
            </Collapsible>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Members />
              Members
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2`}
            >
              <Settings />
              Settings
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
      <div className="col-span-4 flex flex-col gap-4 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[28px]">
            Creator Dashboard
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
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
        <div className="flex items-center justify-between">
          <div className="flex gap-2"><Analytics />Overview</div>
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>All-time subscriber count</CardDescription>
              <CardContent>
                <div className="flex items-center gap-2 text-4xl font-semibold">
                  69K <Badge variant={"success"}>+420%</Badge>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Views</CardTitle>
              <CardDescription>
                Post impressions over the past month
              </CardDescription>
              <CardContent>
                <div className="flex items-center gap-2 text-4xl font-semibold">
                  4.2M <Badge variant={"success"}>+69%</Badge>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>MRR over the past month</CardDescription>
              <CardContent>
                <div className="flex items-center gap-2 text-4xl font-semibold">
                  $420K <Badge variant={"destructive"}>-4.2%</Badge>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
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
