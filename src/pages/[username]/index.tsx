import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { matter } from "~/components/fonts";
import { Loader, Money, Twitter } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useAuthenticated } from "~/lib/useAuthenticated";
import type { Tables } from "~/server/api/supabase/types";
import { api } from "~/utils/api";
import { createSupabaseServerClient } from "~/utils/supabase";
import { type ProductGet } from "~/utils/product";

const ProfilePage = ({
  profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAuthenticated();

  const router = useRouter();

  const { data: products, isLoading } = api.product.getByCreator.useQuery({
    creator: profile.id,
  });

  return (
    <main className={` ${matter.className}`}>
      <div className="flex flex-col gap-4 px-48 py-16">
        <div className="flex items-center justify-center">
          <Image
            src={
              profile.avatar ??
              "https://placehold.co/512/333333/777777/webp?text=" +
                profile.name?.substring(0, 1)
            }
            width={512}
            height={512}
            alt="cover image"
            className="h-24 w-24 rounded-full"
          />
        </div>
        <div className="flex h-full w-full flex-col gap-4 px-10 text-center">
          <div className="text-4xl">{profile.name}</div>
          <div className="line-clamp-2 px-80 text-muted-foreground">
            {profile.bio}
          </div>
          <Separator />
          {isLoading ? (
            <span className="flex h-12 w-full grow items-center justify-center">
              <span className="animate-spin">
                <Loader />
              </span>
            </span>
          ) : products?.length ? (
            <div className="grid grid-cols-3 gap-4 pt-4">
              {(products)?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-left">
                      <Link href={`/${product.creator.username}/${product.id}`}>
                        {product.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-left">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between gap-1">
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
                          <div className="line-clamp-1 w-fit text-left text-sm">
                            {product.creator.name}
                          </div>
                          <span className="text-left text-xs text-muted-foreground">
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
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              This user hasn&apos;t published any products yet.
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Money />
              {profile.wallet ?? "Wallet not added"}
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1">
                <Twitter />
              </span>
              @{profile.twitter}
            </div>
            <div className="text-left text-muted-foreground">
              Joined on{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                day: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  const username = ctx.params!.username!.toString();
  const supabase = createSupabaseServerClient({
    req: ctx.req as NextApiRequest,
    res: ctx.res as NextApiResponse,
  });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single<Tables<"profiles">>();

  if (!profile || error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile,
    },
  };
}) satisfies GetServerSideProps<{ profile: Tables<"profiles"> }>;

export default ProfilePage;
