/* --- OPALWAVE STRIPE GATEWAY 2026 --- */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // 1. Safety Check: Only allow POST requests from your website
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        // 2. Parse the cart items sent from bag.js
        const { items } = JSON.parse(event.body);

        if (!items || items.length === 0) {
            throw new Error("Inventory manifest is empty.");
        }

        // 3. Map items to Stripe format (Price Data approach)
        // This creates the product on-the-fly so you don't need Dashboard IDs
        const lineItems = items.map(item => {
            // Stripe expects cents ($120.00 = 12000)
            const unitAmount = Math.round(parseFloat(item.price) * 100);
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.image], // Shows product photo on Stripe page
                    },
                    unit_amount: unitAmount, 
                },
                quantity: item.quantity,
            };
        });

        // 4. Create the Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            
            // Collects shipping info for these specific regions
            shipping_address_collection: { 
                allowed_countries: ['US', 'CA', 'GB', 'AU'] 
            },
            
            // Collects phone number for easier shipping/delivery updates
            phone_number_collection: { enabled: true },
            
            // Uses the request origin to return the user back to your site
            success_url: `${event.headers.origin}/success.html`,
            cancel_url: `${event.headers.origin}/bag.html`,
        });

        // 5. Return the secure URL to the frontend
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Crucial for frontend communication
            },
            body: JSON.stringify({ url: session.url }),
        };

    } catch (error) {
        console.error("STRIPE_GATEWAY_ERROR:", error.message);
        
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
