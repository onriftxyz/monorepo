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


  console.log("webhook")
  console.log(JSON.stringify(req.body))

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { data } = req.body as SpherePaymentWebhookResponse;


  if (data.payment.status === "succeeded") {
    const { buyer, product } = data.payment.paymentLink.meta;
    const txSig = data.payment.transport.solana.solanaEvent.txSig;
    const amount = data.payment.transactions[0]!.amountUSD;

    console.log(buyer, product, txSig, amount)

    const supabase = createSupabaseServerClient({ req, res });

    console.log(supabase)

    const { error } = await supabase.from("purchases").insert({
      buyer: buyer,
      product: product,
      amount: amount,
      transaction_id: txSig,
    });

    console.log("db")

    if (error) {
      console.error(error);
    }
  }

  res.status(200).setHeader("Content-Type", "application/json").json({
    message: "Received",
  });
}
