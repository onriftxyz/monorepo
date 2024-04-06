import { matter } from "~/components/fonts";
import { cn } from "~/lib/utils";
import { UserSidebar } from "~/components/navigation/sidebar";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { List, ThreeDots } from "~/components/icons";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { api } from "~/utils/api";
import Link from "next/link";

const UserDashboard = () => {
  useAuthenticated();

  const { data: purchases, isLoading } = api.user.purchases.useQuery({
    limit: 5,
  });

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <UserSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Dashboard" minimal />
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-1">
            <span className="text-secondary-foreground">
              <List />
            </span>
            Purchased Items
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[500px]">Item</TableHead>
                <TableHead className="w-fit text-center">Documents</TableHead>
                <TableHead className="w-fit text-center">Price</TableHead>
                <TableHead className="w-fit text-center">Creator</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases?.map((purchase) => (
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
                      <Link
                        href={`/${purchase.product.creator?.twitter}/${purchase.product.id}`}
                      >
                        {purchase.product.title}
                      </Link>
                      <div className="flex text-xs text-secondary-foreground">
                        {new Date(
                          purchase.product.created_at,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                          day: "2-digit",
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.product.content?.length}
                  </TableCell>
                  <TableCell className="text-center">
                    ${purchase.product.price}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Image
                    // TODO: @pybash pls use avatar
                      src={
                        "https://picsum.photos/64" +
                        "?random=" +
                        Math.random() * 10
                      }
                      alt="cover image"
                      width={48}
                      height={48}
                      className="h-8 w-8 flex-shrink-0 rounded-full"
                    />
                    <div>{purchase.product.creator.name}</div>
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
        <div>
          <div>Recommended</div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Another Item</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officiis eum fuga vero.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Image
                      src={
                        "https://picsum.photos/64" +
                        "?random=" +
                        Math.random() * 10
                      }
                      alt="cover image"
                      width={32}
                      height={32}
                      className="h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <div>Crea Tor,</div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button>Buy</Button>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Different Item</CardTitle>
                <CardDescription>
                  Neque labore repudiandae reiciendis optio sapiente excepturi
                  ab? Eum in reprehenderit.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Image
                      src={
                        "https://picsum.photos/64" +
                        "?random=" +
                        Math.random() * 10
                      }
                      alt="cover image"
                      width={32}
                      height={32}
                      className="h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <div>Crea Tor,</div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button>Buy</Button>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>A Third</CardTitle>
                <CardDescription>
                  Nobis inventore iure deleniti illum, minima deserunt delectus
                  possimus facilis magnam.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Image
                      src={
                        "https://picsum.photos/64" +
                        "?random=" +
                        Math.random() * 10
                      }
                      alt="cover image"
                      width={32}
                      height={32}
                      className="h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <div>Crea Tor,</div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button>Buy</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;
