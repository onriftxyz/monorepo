import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { matter } from "~/components/fonts";
import { Check, ChevronRight, Cross } from "~/components/icons";
import { useAuthenticated } from "~/lib/useAuthenticated";

const Checkout = ({
  type,
  name,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAuthenticated();

  return (
    <main
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-4 ${matter.className}`}
    >
      <div
        className={`rounded-full border-[6px] p-5 ${type === "FAILED" ? "border-red-400 text-red-400" : "border-green-400 text-green-400"}`}
      >
        {type === "FAILED" ? <Cross size={72} /> : <Check size={72} />}
      </div>
      <div className="text-4xl font-medium">
        Purchase {type === "FAILED" ? "Failed" : "Successful"}!
      </div>
      <div className="text-center text-sm text-muted-foreground">
        {type === "FAILED" ? (
          <>
            You&apos;re payment failed. Make sure you&apos;ve enough funds in
            <br />
            the wallet or try again with a different payment method.
          </>
        ) : (
          <>
            You&apos;ve successfully purchased a copy of {name}. You can now
            access
            <br />
            all of its contents from your dashboard!
          </>
        )}
      </div>
      <Link
        href="/home"
        className="flex items-center font-medium text-secondary-foreground"
      >
        Go to Dashboard <ChevronRight />
      </Link>
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      type: (ctx.query.type as "SUCCESS" | "FAILED") ?? "FAILED",
      name: (ctx.query.name as string) ?? "",
    },
  };
}) satisfies GetServerSideProps<{ type: "SUCCESS" | "FAILED"; name: string }>;

export default Checkout;
