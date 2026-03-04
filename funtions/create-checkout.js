const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // This part automatically figures out if your site is http or https
    const protocol = event.headers['x-forwarded-proto'] || 'http';
    const host = event.headers.host;
    const DOMAIN = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // TODO: Replace with your actual Price ID from Stripe Dashboard
          price: 'price_1QuG9LQTBolXed9at7uYI8n3', 
          quantity: 1,
        },
      ],
      mode: 'payment',

      // THIS IS THE KEY FOR PHYSICAL PRODUCTS:
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add any countries you ship to
      },
      
      // Collect phone number for the delivery driver
      phone_number_collection: {
        enabled: true,
      },

      // Redirects back to your files after payment
      success_url: `${DOMAIN}/success.html`,
      cancel_url: `${DOMAIN}/cancel.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
