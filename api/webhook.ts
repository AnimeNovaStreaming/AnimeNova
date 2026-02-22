import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!,{
  apiVersion:"2023-10-16"
});

export const config = { api: { bodyParser: false } };

export default async function handler(req,res){

  const sig = req.headers["stripe-signature"];

  let event;

  try{
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }catch(err){
    return res.status(400).send("Webhook Error");
  }

  if(event.type==="checkout.session.completed"){
    console.log("User subscribed");
  }

  res.json({received:true});
}