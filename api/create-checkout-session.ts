import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2023-10-16"
});

export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).send("Method Not Allowed");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    mode:"subscription",
    line_items:[{
      price: process.env.STRIPE_PRICE_ID!,
      quantity:1
    }],
    success_url:"https://yourdomain.com/success",
    cancel_url:"https://yourdomain.com/cancel"
  });

  res.json({url:session.url});
}