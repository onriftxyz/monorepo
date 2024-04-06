import Image from "next/image";
import Link from "next/link";
import { matter } from "~/components/fonts";
import { Loader, Pencil, ThreeDots } from "~/components/icons";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { UserSidebar } from "~/components/navigation/sidebar";
import { Button } from "~/components/ui/button";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const Products = () => {
  useAuthenticated();

  const { data: products, isLoading } = api.user.purchases.useQuery({
    limit: 1000,
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
        <CreatorTopNav title="Purchased Products" minimal />
        {isLoading ? (
          <span className="flex h-full w-full grow items-center justify-center">
            <span className="animate-spin">
              <Loader />
            </span>
          </span>
        ) : products?.length ? (
          <div className="flex flex-col gap-4 rounded-lg border border-input p-4">
            {products.map((product) => (
              <div
                key={Math.random()}
                className="flex w-full items-center gap-3.5 p-4"
              >
                <Image
                  src={`https://picsum.photos/64?random=${Math.random() * 10}`}
                  alt="post image"
                  width={64}
                  height={64}
                  className="h-12 w-12 rounded-md"
                />
                <div className="flex flex-col gap-0.5">
                  <div>{product.products.title}</div>
                  <div className="line-clamp-1 text-sm text-secondary-foreground">
                    Random long description. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Quo sequi quas ullam. Fugiat
                    vero sed dolores officia iure quaerat, quidem ea? Saepe
                    magni quae debitis vitae totam ducimus modi provident!
                  </div>
                </div>
                <Button className="shrink-0" size={"icon"} variant="ghost">
                  <Pencil size={20} />
                </Button>
                <Button className="shrink-0" size={"icon"} variant="ghost">
                  <ThreeDots size={20} />
                </Button>
              </div>
            ))}
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
      </div>
    </main>
  );
};

export default Products;
