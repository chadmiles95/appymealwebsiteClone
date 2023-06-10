const stripe = require("stripe")(process.env.stripe_secret_key);

const createCheckoutSession = async (req, res) => {
  const { items, email, finalAmt } = req.body;

  const modifiedItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.item,
      },
    },
    quantity: item.quantity,
    // description: item.description,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    amount_total: finalAmt,
    line_items: modifiedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/cart`,
    customer_email: email,
  });

  res.status(200).json({
    id: session.id,
  });
};

export default createCheckoutSession;
