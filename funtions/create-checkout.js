const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const protocol = event.headers['x-forwarded-proto'] || 'http';
    const host = event.headers.host;
    const DOMAIN = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1QuG9LQTBolXed9at7uYI8n3', // <-- DOUBLE CHECK THIS PRICE ID IN STRIPE
        quantity: 1,
      }],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], 
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${DOMAIN}/success.html`,
      cancel_url: `${DOMAIN}/index.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
