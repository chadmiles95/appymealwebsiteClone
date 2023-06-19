import { doc, setDoc } from "firebase/firestore";
import { db } from "../../pages/_app"; // import your Firestore instance
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { sendOrderEmail } from "services/email";
import { updateCount } from "services/ordernumber";

// Initialize your stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

// Webhook handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let event: Stripe.Event;

  if (req.method === "POST") {
    try {
      const buf = await new Promise<Buffer>((resolve, reject) => {
        let chunks: Uint8Array[] = [];
        req.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
      });

      const sig = req.headers["stripe-signature"]! as string;

      // Verify the event by checking its signature
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Successfully constructed event, handle the event type
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session?.metadata?.app === "nextjs") {
          //start adding in logic for order

          const order: any = session?.metadata?.order;

          const docRef = doc(db, "orders", order?.orderDate);
          await setDoc(
            docRef,
            {
              [order?.number]: order,
            },
            { merge: true }
          ).then(async () => {
            try {
              const userRef = doc(db, "users", order?.email);
              await setDoc(
                userRef,
                {
                  [order?.number]: order,
                },
                { merge: true }
              );
            } catch (e) {}
            try {
              //send order email

              let finalAmt = parseFloat((order?.stripeTotal / 100).toFixed(2));
              let cartSum = parseFloat((order?.cartSum / 100).toFixed(2));
              let name = order?.customer;
              let userEmail = order?.email;
              let cart = order?.cartTotal;
              let restName = order?.restaurant;
              let calculatedTip = order?.tip;
              let totalTax = order?.tax;
              let appyFee = order?.AMFee;
              let newCount = order?.number;
              let restaurantPhoneNumber = order?.number;
              let restAddress = order?.doorDashInfo?.pickup_address;
              let restCity = order?.doorDashInfo?.pickup_address;
              let restState = order?.doorDashInfo?.pickup_address;
              let restZip = order?.doorDashInfo?.pickup_address;
              let deliveryQuote = order?.deliveryQuote;

              await sendOrderEmail(
                name,
                userEmail,
                cart,
                restName,
                finalAmt,
                cartSum,
                calculatedTip,
                totalTax,
                appyFee,
                newCount,
                restaurantPhoneNumber,
                restAddress,
                restCity,
                restState,
                restZip,
                deliveryQuote
              );
            } catch {}
            try {
              //update order master count
              updateCount();
            } catch {}
          });
        }
      }

      // Return a response to acknowledge the event was processed successfully
      res.json({ received: true });
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

// Disable the default body parser to receive the raw body as a Buffer in the webhook handler
export const config = {
  api: {
    bodyParser: false,
  },
};
