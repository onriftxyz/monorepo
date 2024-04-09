import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { matter } from "~/components/fonts";
import { Views } from "~/components/icons";
import { toast } from "~/components/ui/use-toast";
import { useAuthenticated } from "~/lib/useAuthenticated";
import { api } from "~/utils/api";
import { type ProductGet } from "~/utils/product";
import { createSupabaseServerClient } from "~/utils/supabase";

const ProductContentPage = ({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAuthenticated();

  const { data: isPurchased } = api.product.isPurchased.useQuery({
    id: product.id,
  });
  const router = useRouter();

  useEffect(() => {
    if (!isPurchased) {
      void router.push(`/${product.creator.username}/${product.id}`);
      toast({
        title: "You have not purchased this product!",
        description:
          "To access the contents of this product, purchase a copy of the product and come back here.",
        variant: "destructive",
      });
    }
  }, [isPurchased, router, product]);

  return (
    <main className={` ${matter.className}`}>
      <nav className="flex items-center justify-between border-b-2 px-8 py-5">
        <Link
          href={`/${product.creator.username}`}
          className="font-medium uppercase"
        >
          {product.creator.name}
        </Link>
      </nav>
      <div className="px-48 py-16">
        <div className="flex h-full w-full items-center justify-between gap-4 px-10">
          <div className="flex items-center gap-4">
            <Image
              src={
                product.images?.[0] ??
                "https://placehold.co/512/333333/777777/webp?text=Cover Image"
              }
              width={124}
              height={124}
              alt="cover image"
            />
            <div className="flex flex-col gap-4">
              <div className="text-4xl">{product.title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {product.description}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <Views />
              {product.views}
            </div>
            <div>
              Published on:{" "}
              {new Date(product.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                day: "2-digit",
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              Contains {product.content?.length}{" "}
              {product.type === "LINK" ? "links" : "files"}.
            </div>
          </div>
        </div>
        <div className="px-24 py-12">
          <div className="text-2xl">
            {product.type === "LINK" ? "Links" : "Files"}
          </div>
          <div className="flex flex-col gap-2 text-blue-400">
            {product.content?.map((content) => (
              <Link href={content} target="_blank" key={content}>
                &bull;{" "}
                <span className="underline underline-offset-2 transition-opacity duration-200 ease-in-out hover:opacity-90">
                  {content}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  const productId = ctx.params!.productId!.toString();
  const id = parseInt(productId, 10);
  const supabase = createSupabaseServerClient({
    req: ctx.req as NextApiRequest,
    res: ctx.res as NextApiResponse,
  });

  const { data: product, error } = await supabase
    .from("products")
    .select("*, creator:profiles!public_products_creator_fkey(*)")
    .eq("id", id)
    .single<ProductGet>();

  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  if (product.creator.username != ctx.params!.username) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
}) satisfies GetServerSideProps<{ product: ProductGet }>;

export default ProductContentPage;
