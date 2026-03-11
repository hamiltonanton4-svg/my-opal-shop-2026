const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1QuG9LQTBolXed9at7uYI8n3', // <-- YOUR PRICE ID
        quantity: 1,
      }],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      phone_number_collection: { enabled: true },
      success_url: `${event.headers.origin}/success.html`,
      cancel_url: `${event.headers.origin}/index.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};