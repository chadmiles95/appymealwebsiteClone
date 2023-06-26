import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../pages/_app"; // import your Firestore instance
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { sendOrderEmail } from "services/email";
import { updateCount } from "services/ordernumber";
import deletePendingOrder from "services/deletePendingOrder";

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
          // Retrieve the pending order from the "pendingOrders" collection using the email address

          let email = session?.customer_email
            ? session?.customer_email
            : JSON.parse(session?.metadata?.email);

          const pendingOrderRef = await doc(db, "pendingOrders", email);
          const pendingOrderSnapshot = await getDoc(pendingOrderRef);
          const pendingOrder = pendingOrderSnapshot.data()?.pendingOrder;

          const docRef = await doc(db, "orders", pendingOrder.orderDate);

          await setDoc(
            docRef,
            {
              [pendingOrder.number]: {
                ...pendingOrder,
                orderInfo: session,
                paymentIntent: session?.payment_intent,
              },
            },
            { merge: true }
          ).then(async () => {
            try {
              const userRef = doc(db, "users", pendingOrder?.email);
              await setDoc(
                userRef,
                {
                  [pendingOrder?.number]: pendingOrder,
                },
                { merge: true }
              );
            } catch (e) {}
            try {
              //send order email

              let finalAmt = parseFloat(
                (pendingOrder?.stripeTotal / 100).toFixed(2)
              );
              let cartSum = parseFloat(
                (pendingOrder?.cartSum / 100).toFixed(2)
              );
              let name = pendingOrder?.customer;
              let userEmail = pendingOrder?.email;
              let cart = pendingOrder?.cartTotal;
              let restName = pendingOrder?.restaurant;
              let calculatedTip = pendingOrder?.tip;
              let totalTax = pendingOrder?.tax;
              let appyFee = pendingOrder?.AMFee;
              let newCount = pendingOrder?.number;
              let restaurantPhoneNumber = pendingOrder?.number;
              let restAddress = pendingOrder?.doorDashInfo?.pickup_address;
              let restCity = pendingOrder?.doorDashInfo?.pickup_address;
              let restState = pendingOrder?.doorDashInfo?.pickup_address;
              let restZip = pendingOrder?.doorDashInfo?.pickup_address;
              let deliveryQuote = pendingOrder?.deliveryQuote;

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
              deletePendingOrder(email);
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
