const stripe = require("stripe")(process.env.stripe_secret_key);

const createCheckoutSession = async (req, res) => {
  const { items, email, tip, tax, deliveryFee } = req.body;

  const modifiedItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.item,
      },
    },
    quantity: item.quantity,
  }));

  // Add tip to the line items if it's not zero
  if (tip && tip > 0) {
    modifiedItems.push({
      price_data: {
        currency: "usd",
        unit_amount: tip * 100, // multiply by 100 to convert dollars to cents
        product_data: {
          name: "Tip",
        },
      },
      quantity: 1,
    });
  }

  // Add tax to the line items if it's not zero
  if (tax && tax > 0) {
    modifiedItems.push({
      price_data: {
        currency: "usd",
        unit_amount: tax * 100,
        product_data: {
          name: "Tax",
        },
      },
      quantity: 1,
    });
  }

  // Add delivery fee to the line items if it's not zero
  if (deliveryFee && deliveryFee > 0) {
    modifiedItems.push({
      price_data: {
        currency: "usd",
        unit_amount: deliveryFee,
        product_data: {
          name: "Delivery Fee",
        },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
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
