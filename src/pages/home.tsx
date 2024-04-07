import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { matter } from "~/components/fonts";
import { List, Loader, ThreeDots } from "~/components/icons";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { UserSidebar } from "~/components/navigation/sidebar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const UserDashboard = () => {
  useAuthenticated();

  const router = useRouter();

  const { data: purchases, isLoading: isLoadingPurchases } =
    api.user.purchases.useQuery({
      limit: 5,
    });

  const {
    data: mostPurchasedProducts,
    isLoading: isLoadingMostPurchasedProducts,
  } = api.product.mostPurchased.useQuery({
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
        {isLoadingPurchases ? (
          <span className="flex max-h-96 w-full grow items-center justify-center">
            <span className="animate-spin">
              <Loader />
            </span>
          </span>
        ) : purchases?.length ? (
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
                        src={purchase.product.creator.avatar!}
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
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            You haven&apos;t purchased any products yet.{" "}
            <Link
              href="/explore"
              className="underline decoration-1 underline-offset-4 duration-200 ease-in-out hover:text-accent"
            >
              Explore new products.
            </Link>
          </div>
        )}
        {isLoadingMostPurchasedProducts ? (
          <span className="flex max-h-96 w-full grow items-center justify-center">
            <span className="animate-spin">
              <Loader />
            </span>
          </span>
        ) : mostPurchasedProducts?.length ? (
          <div>
            <div>Recommended</div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {mostPurchasedProducts?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/${product.creator.twitter}/${product.id}`}>
                        {product.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <Image
                          src={
                            product.creator.avatar ||
                            "https://placehold.co/32.webp?text=" +
                              product.creator.name?.substring(0, 1)
                          }
                          alt="cover image"
                          width={32}
                          height={32}
                          className="h-8 w-8 flex-shrink-0 rounded-full"
                        />
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">{product.creator.name}</div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(product.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                                day: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          router.push(
                            `/${product.creator.twitter}/${product.id}`,
                          )
                        }
                      >
                        Buy
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            Could not find any recommendations for you.
          </div>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
