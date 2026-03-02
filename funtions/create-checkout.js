const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Dynamically detect your site's URL
    const protocol = event.headers['x-forwarded-proto'] || 'http';
    const host = event.headers.host;
    const DOMAIN = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // Make sure this matches your Price ID from Stripe Dashboard
          price: 'price_1QuG9LQTBolXed9at7uYI8n3', 
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Sends them back to the main page with a "Success" message
      success_url: `${DOMAIN}/?success=true`,
      cancel_url: `${DOMAIN}/?cancel=true`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};