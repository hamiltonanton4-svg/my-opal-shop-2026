<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Bag | Opalwave</title>
  <link rel="stylesheet" href="css/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>

  <div id="site-header"></div>

  <main class="container" style="margin-top: 5rem;">
    <header class="section-top">
      <div>
        <p class="section-label">Checkout</p>
        <h2>Your Bag</h2>
      </div>
      <button id="clearCartBtn" class="text-link" style="background:none; border:none; cursor:pointer;">Clear Bag</button>
    </header>

    <div class="shop-layout" style="display: grid; grid-template-columns: 1fr 350px; gap: 4rem;">
      
      <section id="cart-items-list">
        </section>

      <aside>
        <div class="hero" style="padding: 2.5rem; margin-top: 0; border-radius: 24px; position: sticky; top: 120px;">
          <h3 style="margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.9rem;">Order Summary</h3>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span class="muted">Subtotal</span>
            <span id="subtotal" style="font-weight: 700;">$0.00</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <span style="font-weight: 900;">Total</span>
            <span id="total" style="font-weight: 900; color: var(--primary);">$0.00</span>
          </div>

          <button id="stripeCheckoutBtn" class="btn btn-primary" style="width: 100%;">Complete Purchase</button>
          
          <p class="muted" style="font-size: 0.7rem; text-align: center; margin-top: 1.5rem;">
            Secure payment powered by Stripe.
          </p>
        </div>
      </aside>
    </div>
  </main>

  <div id="site-footer"></div>

  <script src="js/products.js"></script>
  <script src="js/app.js"></script>
  </body>
</html>
