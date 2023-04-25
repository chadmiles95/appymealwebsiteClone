const stripe = require("stripe")(process.env.stripe_secret_key);

export default async (req, res) => {
  const { items, email } = req.body;

  const modifiedItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
      },
    },
    quantity: item.quantity,
    // description: item.description,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: modifiedItems,
    mode: "payment",
    currency: "USD",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
    },
  });

  res.status(200).json({
    id: session.id,
  });
};
