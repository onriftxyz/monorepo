import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { matter } from "~/components/fonts";
import { ChevronLeft, ChevronRight, Views } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { type ProductGet } from "~/utils/product";
import { createSupabaseServerClient } from "~/utils/supabase";

const ProductPage = ({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(product);

  return (
    <main className={` ${matter.className}`}>
      <nav className="flex items-center justify-between border-b-2 px-8 py-5">
        <Link href="/username" className="font-medium uppercase">
          {product.creator.name}
        </Link>
      </nav>
      <div className="grid grid-cols-2 gap-4 px-48 py-16">
        <div className="relative">
          <Image
            src="https://placehold.co/512/333333/777777/webp?text=Cover Image"
            width={512}
            height={512}
            alt="cover image"
            className="h-full w-full"
          />
          <button className="absolute left-2 top-1/2 -translate-y-1/2">
            <ChevronLeft size={32} />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronRight size={32} />
          </button>
        </div>
        <div className="flex h-full w-full flex-col gap-4 px-10">
          <div className="text-4xl">{product.title}</div>
          <div className="line-clamp-2 text-muted-foreground">
            {product.description}
          </div>
          <div className="text-2xl">${product.price}</div>
          <Button className="w-full" size="lg">
            Buy Now
          </Button>
          <Separator />
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
              You will unlock {product.content?.length}{" "}
              {product.type === "LINK" ? "links" : "files"}.
            </div>
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
    .select("*, creator: profiles(*)")
    .eq("id", id)
    .single<ProductGet>();

  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  // TODO: So username cannot be optional, make mandatory
  
  if (product.creator.twitter != ctx.params!.username) {
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

export default ProductPage;
