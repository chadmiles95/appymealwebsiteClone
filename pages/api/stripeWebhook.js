const { doc, setDoc, getDoc, deleteDoc } = require("firebase/firestore");
const Stripe = require("stripe");
const { sendOrderEmail } = require("../../services/email");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const breakDownAddress = (address) => {
  const addressComponents = address
    .split(",")
    .map((component) => component.trim());

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  const zipMatch =
    addressComponents[addressComponents.length - 1].match(zipRegex);
  const zip = zipMatch ? zipMatch[0] : "";

  let city = "";
  let state = "";

  if (addressComponents.length > 1) {
    const cityStateZip =
      addressComponents[addressComponents.length - 2].split(/\s+/);
    if (cityStateZip.length > 1) {
      state = cityStateZip.pop();
      city = cityStateZip.join(" ");
    } else {
      city = cityStateZip[0];
    }
  }

  const street = addressComponents[0];

  return {
    street,
    city,
    state,
    zip,
  };
};

const updateCount = async () => {
  const docRef = doc(db, "orders", "number");
  const docSnap = await getDoc(docRef);
  let newCount = docSnap?.data().ordernumber;
  try {
    const docRef = doc(db, "orders", "number");
    setDoc(
      docRef,
      {
        ordernumber: newCount + 1,
      },
      { merge: true }
    );
  } catch (e) {
    return;
  }
};

async function deletePendingOrder(email) {
  const docRef = doc(db, "pendingOrders", email);
  await deleteDoc(docRef);
}

//initalize Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//initalize FB

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function handler(req, res) {
  let event;

  if (req.method === "POST") {
    try {
      const buf = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
      });

      const sig = req.headers["stripe-signature"];

      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        if (session?.metadata?.app === "nextjs") {
          let email = session?.customer_email;

          // const pendingOrderRef =  doc(db, "pendingOrders", email);
          if (email && db) {
            // const pendingOrderRef = db.collection("pendingOrders").doc(email);
            const pendingOrderRef = doc(db, "pendingOrders", email);

            const pendingOrderSnapshot = await getDoc(pendingOrderRef);

            const pendingOrder = pendingOrderSnapshot.data()?.pendingOrder;

            const docRef = doc(db, "orders", pendingOrder.orderDate);

            //fucntion check order number - if the number in the order number is the same as in the obj, then we are good. If not, pull new number and use that.

            const orderRef = doc(db, "orders", "number");
            const docSnap = await getDoc(orderRef);
            let total_count = docSnap?.data()?.ordernumber;

            total_count
              ? total_count === pendingOrder.number
                ? null
                : (pendingOrder.number = total_count)
              : null;

            // change status in orderInfo to "succeeded" if it is "complete" in the "session" object

            session?.status === "complete"
              ? (session.status = "succeeded")
              : null;

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
              //code seems to stop here

              try {
                const userRef = doc(db, "users", email);
                await setDoc(
                  userRef,
                  {
                    [pendingOrder.number]: {
                      ...pendingOrder,
                      orderInfo: session,
                      paymentIntent: session?.payment_intent,
                    },
                  },
                  { merge: true }
                );
              } catch (e) {
                console.log("ERRROR", e);
              }
              try {
                const { street, city, state, zip } = await breakDownAddress(
                  pendingOrder?.doorDashInfo?.pickup_address
                );

                let finalAmt = parseFloat(
                  (pendingOrder?.stripeTotal).toFixed(2)
                  // (pendingOrder?.stripeTotal / 100).toFixed(2)
                );
                let cartSum = parseFloat(
                  (pendingOrder?.cartTotal).toFixed(2)
                  // (pendingOrder?.cartTotal / 100).toFixed(2)
                );
                let name = pendingOrder?.customer;
                let userEmail = email;
                let cart = pendingOrder?.cart;
                let restName = pendingOrder?.restaurant;
                let calculatedTip = pendingOrder?.tip;
                let totalTax = pendingOrder?.tax;
                let appyFee = pendingOrder?.AMFee;
                let newCount = pendingOrder?.number;
                let restaurantPhoneNumber = pendingOrder?.number;
                let restAddress = street;
                let restCity = city;
                let restState = state;
                let restZip = zip;
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
              } catch (error) {
                console.log("Error sending order email:", error);
              }

              try {
                updateCount();

                deletePendingOrder(email);
              } catch (error) {
                console.log(
                  "Error updating count or deleting pending order:",
                  error
                );
              }
            });
          }
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.log(`Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

module.exports = handler;

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
