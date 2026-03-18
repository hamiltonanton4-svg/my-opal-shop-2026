const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // 1. Safety Check: Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 2. Get the items sent from your bag.js
    const { items } = JSON.parse(event.body);

    // 3. Map the Bag Items to Stripe's format
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image], // Shows the product photo on Stripe's page
        },
        unit_amount: Math.round(item.price * 100), // Stripe calculates in cents ($50 = 5000)
      },
      quantity: item.quantity,
    }));

    // 4. Create the Real Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems, // Now using the ACTUAL items from the bag
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      phone_number_collection: { enabled: true },
      success_url: `${event.headers.origin}/success.html`,
      cancel_url: `${event.headers.origin}/bag.html`,
    });

    // 5. Send the link back to bag.js
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Stripe Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
