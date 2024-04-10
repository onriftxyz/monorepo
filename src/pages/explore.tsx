/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { matter } from "~/components/fonts";
import { Loader } from "~/components/icons";
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
import { useAuthenticated } from "~/lib/useAuthenticated";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const Explore = () => {
  useAuthenticated();

  const router = useRouter();

  const {
    data: mostPurchasedProducts,
    isLoading: isLoadingMostPurchasedProducts,
  } = api.product.mostPurchased.useQuery({});

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <UserSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title="Explore" minimal />
        {isLoadingMostPurchasedProducts ? (
          <span className="flex h-full w-full grow items-center justify-center">
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
                  <CardHeader className="flex gap-2 flex-row">
                  <Image src={product.images?.[0] as string} alt="cover" width={64} height={64} className="shrink-0 h-10 w-10 rounded-lg" />
                  <div>
                    <CardTitle>
                      <Link href={`/${product.creator.username}/${product.id}`}>
                        {product.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>

                  </div>
                  </CardHeader>
                  <CardContent></CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <Image
                          src={
                            product.creator.avatar ??
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
                            `/${product.creator.username}/${product.id}`,
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

export default Explore;
