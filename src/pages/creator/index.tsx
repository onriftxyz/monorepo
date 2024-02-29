import { matter } from "~/components/fonts";
import {
  useDynamicContext,
  useUserWallets,
  useEmbeddedWallet,
  useEmbeddedReveal,
} from "@dynamic-labs/sdk-react-core";

import {
  Analytics,
  ArrowRight,
  Comment,
  Draft,
  Like,
  List,
  Members,
  Money,
  ThreeDots,
  Views,
} from "~/components/icons";
import { Button } from "~/components/ui/button";
import { OverviewCard } from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "~/components/ui/select";
import Image from "next/image";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { useEffect } from "react";

const CreatorDashboard = () => {
  const dynCtx = useDynamicContext();
  const userWallets = useUserWallets();
  const { setShowAuthFlow } = dynCtx;
  const { createEmbeddedWallet, userHasEmbeddedWallet } = useEmbeddedWallet();
  const { initExportProcess } = useEmbeddedReveal();

  console.log(
    "asdlkfalsdkfjlasdfasdf ---- USER WALLETS ----- askljdfakdjfkasdf",
  );
  console.log(userWallets);

  function bringitin() {
    setShowAuthFlow(true);
  }

  function hereyougo() {
    try {
      const walletId = createEmbeddedWallet();
      console.log(walletId);
    } catch (e) {}
  }

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      {/* <CreatorSidebar /> */}
      <div className="text-white">
        {userWallets.length > 0 ? (
          userWallets.map((wallet) => (
            <p key={wallet.id}>
              {wallet.address}:{" "}
              {wallet.connected ? "Connected" : "Not connected"}
            </p>
          ))
        ) : (
          <div>
            <p className="text-white">No wallets on this account</p>
            <p className="text-white">do one of two things:</p>
            <button onClick={bringitin}>connect your wallet</button>
            {userHasEmbeddedWallet() ? (
              <p>you alr seem to have one 👀 {}</p>
            ) : (
              <button onClick={hereyougo}>
                let us provision you a wallet which you have custody over
              </button>
            )}
          </div>
        )}
        {dynCtx.user?.email}
        <button onClick={() => initExportProcess()}>fuck</button>;
      </div>
      {/* <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Creator Dashboard" />
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
          <div className="col-span-3 rounded-lg border border-border p-4">
            <div className="flex items-center gap-1">
              <span className="text-secondary-foreground">
                <List />
              </span>
              Posts
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[500px]">Post</TableHead>
                  <TableHead className="w-fit text-center">Views</TableHead>
                  <TableHead className="w-fit text-center">Revenue</TableHead>
                  <TableHead className="w-fit text-center">
                    New Members
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill("post")
                  .map(() => (
                    <TableRow key={Math.random() * 100}>
                      <TableCell className="flex items-center gap-2">
                        <Image
                          src={
                            "https://picsum.photos/64" +
                            "?random=" +
                            Math.random() * 10
                          }
                          alt="cover image"
                          width={64}
                          height={64}
                          className="h-12 w-12 flex-shrink-0 rounded-md"
                        />
                        <div className="flex w-full flex-col gap-0.5">
                          <div>Post title</div>
                          <div className="flex text-xs text-secondary-foreground">
                            {new Date().toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                              day: "2-digit",
                            })}{" "}
                            &bull;&nbsp;
                            <Comment size={16} />
                            &nbsp;
                            {Math.round(Math.random() * 10)} comments
                            &bull;&nbsp;
                            <Like size={16} />
                            &nbsp;
                            {Math.round(Math.random() * 100)} likes
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {Math.round(Math.random() * 100000)}
                      </TableCell>
                      <TableCell className="text-center">
                        ${`${(Math.random() * 1000000) / 100}`.substring(0, 7)}
                      </TableCell>
                      <TableCell className="text-center">
                        {Math.round(Math.random() * 100000)}
                      </TableCell>
                      <TableCell className="w-6">
                        <Button size="icon" variant="ghost">
                          <ThreeDots />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-secondary-foreground">
                  <Draft />
                </span>
                Drafts
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground">
                  {Math.round(Math.random() * 10)}
                </span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-4">
              {Array(5)
                .fill("draft")
                .map(() => (
                  <div key={Math.random()} className="flex items-center gap-2">
                    <Image
                      src={
                        "https://picsum.photos/64" +
                        "?random=" +
                        Math.random() * 10
                      }
                      alt="cover image"
                      width={64}
                      height={64}
                      className="h-12 w-12 flex-shrink-0 rounded-md"
                    />
                    <div className="flex w-full flex-col gap-0.5">
                      <div className="line-clamp-1">
                        Draft post title which is very long for demo purposes
                      </div>
                      <div className="line-clamp-1 text-xs text-secondary-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quod itaque adipisci nemo ratione, deserunt, non sed,
                        quas ducimus unde esse quisquam. Sed porro alias
                        adipisci quibusdam ipsum cupiditate eos amet?
                      </div>
                    </div>
                    <span className="text-secondary-foreground">
                      <ThreeDots />
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div> */}
    </main>
  );
};

export default CreatorDashboard;
