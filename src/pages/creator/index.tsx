import { matter } from "~/components/fonts";
import {
  Analytics,
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
import Image from "next/image";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { api } from "~/utils/api";
import { type Tables } from "~/server/api/supabase/types";
import { type UserProductWithStats } from "~/utils/product";

const CreatorDashboard = () => {
  const userStats = api.user.stats.useQuery().data;
  const userProducts = api.product.mine.useQuery()
    .data as UserProductWithStats[];
  // TODO: @pybash implement some loading logic
  if (!userStats || !userProducts) return null;

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Creator Dashboard" />
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <span className="text-secondary-foreground">
              <Analytics />
            </span>
            Overview
          </div>
          {/* <div>
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
          </div> */}
        </div>
        <div className="flex items-center gap-6">
          <OverviewCard
            title={"Customers"}
            data={userStats.uniqueBuyers.toString()}
            variant={"success"}
            icon={<Members />}
          />
          <OverviewCard
            title={"Views"}
            data={userStats.totalViews.toString()}
            variant={"success"}
            icon={<Views />}
          />
          <OverviewCard
            title={"Revenue"}
            data={userStats.totalRevenue.toString()}
            variant={"destructive"}
            icon={<Money />}
          />
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-1">
            <span className="text-secondary-foreground">
              <List />
            </span>
            Products
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[500px]">Product</TableHead>
                <TableHead className="w-fit text-center">Views</TableHead>
                <TableHead className="w-fit text-center">Revenue</TableHead>
                <TableHead className="w-fit text-center">Customers</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(userProducts as Tables<"products">[]).map((userProduct) => (
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
                      <div>{userProduct.title}</div>
                      <div className="flex text-xs text-secondary-foreground">
                        {new Date(userProduct.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                            day: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {userProduct.views}
                  </TableCell>
                  <TableCell className="text-center">
                    {/*NOTE: idk why eslint is complaining about this */}$
                    {userProduct.revenue}
                  </TableCell>
                  <TableCell className="text-center">
                    {/*NOTE: idk why eslint is complaining about this */}$
                    {userProduct.customers}
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
      </div>
    </main>
  );
};

export default CreatorDashboard;
