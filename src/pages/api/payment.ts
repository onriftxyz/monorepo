import type { NextApiRequest, NextApiResponse } from "next";
import { Tables } from "~/server/api/supabase/types";
import { type SpherePaymentWebhookResponse } from "~/utils/spherepay";
import { createSupabaseServerClient } from "~/utils/supabase";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log("Payment webhook: Request Method:", req.method);
  console.log(req.body);

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { data } = req.body as SpherePaymentWebhookResponse;

  if (data.payment.status === "success") {
    const { buyer, product } = data.payment.meta;
    const txSig = data.payment.transport.solana.solanaEvent.txSig;
    const amount = data.payment.transactions[0]!.amountUSD;

    const supabase = createSupabaseServerClient({ req, res });

    const { error } = await supabase.from("purchases").insert({
      buyer: buyer,
      product: product,
      amount: amount,
      transaction_id: txSig,
    });

    if (error) {
      console.error(error);
    }
  }

  res.status(200).setHeader("Content-Type", "application/json").json({
    message: "Received",
  });
}
