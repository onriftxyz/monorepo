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
import { productRouter } from "~/server/api/routers/product";
import { createTRPCCaller, createTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

const ProductPage = ({
  id,
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {


  return (
    <main className={` ${matter.className}`}>
      <nav className="flex items-center justify-between border-b-2 px-8 py-5">
        <Link href="/username" className="font-medium uppercase">
          {product.creator}
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            mollitia quasi fugit, assumenda sequi fugiat. Necessitatibus itaque
            officiis praesentium quidem, tenetur iure fugit quam blanditiis,
            placeat exercitationem debitis neque enim?
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
            <div>Published on: {product.created_at}</div>
            <div className="text-sm text-muted-foreground">
              You will unlock {product.content.length}{" "}
              {product.type === "LINK" ? "links" : "files"}.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  //   const product = createTRPCCaller(productRouter);
  //   try {
  //     const products = (await product(
  //       createTRPCContext({
  //         req: ctx.req as NextApiRequest,
  //         res: ctx.res as NextApiResponse,
  //       }),
  //     ).get({ creator: ctx.query.username as string })) as {
  //       content: string[] | null;
  //       created_at: string;
  //       creator: string | null;
  //       id: number;
  //       price: number;
  //       title: string;
  //       type: "LINK" | "UPLOAD" | "MARKDOWN";
  //       updated_at: string;
  //       views: number;
  //     }[];

  //     return {
  //       props: {
  //         id: Number(ctx.query.productId),
  //         product: products.filter(
  //           (product) => product.id === Number(ctx.query.productId),
  //         )[0]!,
  //       },
  //     };
  //   } catch (e) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  return {
    props: {
      id: 0,
      product: {
        content: ["test", "test 2"],
        created_at: new Date().toLocaleDateString(),
        creator: "py_bash1",
        id: 0,
        price: 69.0,
        title: "Test product",
        type: "LINK",
        updated_at: "",
        views: 420,
      },
    },
  };
}) satisfies GetServerSideProps<{
  id: number;
  product: {
    content: string[] | null;
    created_at: string;
    creator: string | null;
    id: number;
    price: number;
    title: string;
    type: "LINK" | "UPLOAD" | "MARKDOWN";
    updated_at: string;
    views: number;
  };
}>;

export default ProductPage;
