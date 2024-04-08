import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { matter } from "~/components/fonts";
import { CreatorTopNav } from "~/components/navigation/navbar";
import { CreatorSidebar } from "~/components/navigation/sidebar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { IconInput, Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { EditProductSchema } from "~/utils/forms";
import type { ProductGet } from "~/utils/product";
import { createSupabaseServerClient } from "~/utils/supabase";

const EditProduct = ({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const editProductForm = useForm<z.infer<typeof EditProductSchema>>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      name: product.title,
      description: product.description!,
      price: product.price,
      content: product.content!,
      images: product.images!,
    },
  });

  const { mutateAsync: update } = api.product.update.useMutation();

  useEffect(() => {
    const { unsubscribe } = editProductForm.watch((data) => {
      update({
        id: product.id,
        title: data.name,
        description: data.description,
        price: Number(data.price),
        // content: data.content!,
      })
        .then(() => {
          toast({ title: "Product details updated!" });
        })
        .catch(() => {
          toast({
            title: "Could not update product details!",
            variant: "destructive",
          });
        });
    });

    return () => unsubscribe();
  }, []);

  return (
    <main
      className={cn(
        "grid min-h-screen grid-cols-5 divide-x-[1px] divide-muted bg-background",
        matter.className,
      )}
    >
      <CreatorSidebar />
      <div className="col-span-4 flex flex-col gap-5 px-8 py-5">
        <CreatorTopNav title={`Edit ${product.title}`} />
        <Form {...editProductForm}>
          <form className="flex w-full flex-col gap-6 px-80 py-8">
            {/* <div className="flex justify-center">
                  <ImageUpload
                    form={editProductForm}
                    defaultAvatar={
                      user?.profile.avatar ||
                      "https://placehold.co/256/333/777.webp?text=PFP"
                    }
                  />
                </div> */}
            <FormField
              control={editProductForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Learn to Cook Book" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editProductForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your product or content..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editProductForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <div className="flex w-full items-center">
                    <FormControl>
                      <IconInput {...field} placeholder="6.99" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (!!error || !!userError) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  if (product.creator.id !== user.user.id) {
    return { notFound: true };
  }

  return {
    props: {
      product,
    },
  };
}) satisfies GetServerSideProps<{ product: ProductGet }>;

export default EditProduct;
