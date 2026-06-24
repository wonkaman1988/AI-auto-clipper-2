const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ========== PRICING TIERS ==========
const plans = {
  starter: { id: 'starter', name: 'Starter', price: 900, priceDisplay: '$9', description: '5 videos/month' },
  pro: { id: 'pro', name: 'Pro', price: 4900, priceDisplay: '$49', description: '50 videos/month' },
  agency: { id: 'agency', name: 'Agency', price: 19900, priceDisplay: '$199', description: 'Unlimited videos' }
};

// ========== LANDING PAGE HTML ==========
const landingPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Auto-Clipper - Turn Viral Videos Into Daily Posts</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      margin: 0 1.5rem;
      font-size: 0.9rem;
    }
    
    nav a:hover {
      opacity: 0.8;
    }
    
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }
    
    .cta-button {
      display: inline-block;
      background: white;
      color: #667eea;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      margin: 0 0.5rem;
      border: none;
      cursor: pointer;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .cta-button-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }
    
    .features {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }
    
    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      text-align: center;
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }
    
    .pricing {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }
    
    .pricing-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .pricing-card {
      background: white;
      padding: 2.5rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      position: relative;
      transition: transform 0.3s ease;
      text-align: center;
    }
    
    .pricing-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
    }
    
    .pricing-card.featured {
      border: 3px solid #667eea;
      transform: scale(1.05);
    }
    
    .pricing-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #667eea;
    }
    
    .price {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin: 1rem 0;
    }
    
    .price-period {
      color: #666;
      font-size: 0.9rem;
    }
    
    .pricing-features {
      list-style: none;
      margin: 1.5rem 0;
      text-align: left;
    }
    
    .pricing-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      color: #666;
    }
    
    .pricing-features li:before {
      content: "✓ ";
      color: #667eea;
      font-weight: bold;
      margin-right: 0.5rem;
    }
    
    .checkout-btn {
      background: #667eea;
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1rem;
      width: 100%;
      margin-top: 1rem;
      transition: background 0.3s;
    }
    
    .checkout-btn:hover {
      background: #764ba2;
    }
    
    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }
    
    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }
    
    footer {
      background: #333;
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }
      .pricing-card.featured {
        transform: scale(1);
      }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">🎬 AI Auto-Clipper</div>
      <div>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </div>
    </nav>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1>Turn Viral Videos Into Daily Posts</h1>
      <p>AI Auto-Clipper finds the best moments and creates ready-to-post clips automatically.</p>
      <button class="cta-button" onclick="document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})">Start Free Trial</button>
    </div>
  </section>

  <section class="features" id="features">
    <div class="features-container">
      <h2 class="section-title">Why Choose AI Auto-Clipper?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI-Powered Detection</h3>
          <p>Our AI watches your videos and identifies the most viral moments automatically.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Save 10+ Hours/Week</h3>
          <p>No more manual editing. Get ready-to-post clips in minutes, not hours.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Multi-Platform Ready</h3>
          <p>Clips automatically sized for TikTok, Instagram Reels, YouTube Shorts & more.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="pricing" id="pricing">
    <div class="pricing-container">
      <h2 class="section-title">Simple, Transparent Pricing</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Starter</h3>
          <div class="price">$9<span class="price-period">/month</span></div>
          <p>Perfect for creators just starting</p>
          <ul class="pricing-features">
            <li>5 videos/month</li>
            <li>Unlimited clips</li>
            <li>Basic analytics</li>
          </ul>
          <button class="checkout-btn" onclick="startCheckout('starter')">Start Now</button>
        </div>
        
        <div class="pricing-card featured">
          <h3>Pro</h3>
          <div class="price">$49<span class="price-period">/month</span></div>
          <p>Most popular for growing channels</p>
          <ul class="pricing-features">
            <li>50 videos/month</li>
            <li>Unlimited clips</li>
            <li>Advanced analytics</li>
            <li>Daily automation</li>
          </ul>
          <button class="checkout-btn" onclick="startCheckout('pro')">Start Now</button>
        </div>
        
        <div class="pricing-card">
          <h3>Agency</h3>
          <div class="price">$199<span class="price-period">/month</span></div>
          <p>For managing multiple channels</p>
          <ul class="pricing-features">
            <li>Unlimited videos</li>
            <li>Unlimited clips</li>
            <li>Full analytics</li>
            <li>Team support</li>
          </ul>
          <button class="checkout-btn" onclick="startCheckout('agency')">Start Now</button>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <h2>Ready to automate your clips?</h2>
    <p>Join creators already saving hours every week with AI Auto-Clipper</p>
  </section>

  <footer>
    <p>&copy; 2024 AI Auto-Clipper. All rights reserved.</p>
  </footer>

  <script>
    function startCheckout(plan) {
      console.log('Starting checkout for plan:', plan);
      fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: plan })
      })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Error: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error starting checkout');
      });
    }
  </script>
</body>
</html>`;

// ========== SUCCESS PAGE ==========
const successPageHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - AI Auto-Clipper</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
    }
    .checkmark {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    p {
      color: #666;
      margin-bottom: 2rem;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
    }
    .button:hover {
      background: #764ba2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark">✅</div>
    <h1>Payment Successful!</h1>
    <p>Thank you for subscribing to AI Auto-Clipper. Your account is ready to use!</p>
    <p>Check your email for login details and next steps.</p>
    <a href="/" class="button">Go to Dashboard</a>
  </div>
</body>
</html>`;

// ========== CANCEL PAGE ==========
const cancelPageHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Cancelled - AI Auto-Clipper</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    p {
      color: #666;
      margin-bottom: 2rem;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
    }
    .button:hover {
      background: #764ba2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⏸️</div>
    <h1>Payment Cancelled</h1>
    <p>No worries! You can try again anytime. We're here when you're ready.</p>
    <a href="/" class="button">Back to Home</a>
  </div>
</body>
</html>`;

// ========== ROUTES ==========

// Landing page (root)
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(landingPageHTML);
});

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!plans[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const selectedPlan = plans[plan];
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: \`AI Auto-Clipper - \${selectedPlan.name}\`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: \`\${process.env.DOMAIN || 'https://web-production-42ad7.up.railway.app'}/success.html\`,
      cancel_url: \`\${process.env.DOMAIN || 'https://web-production-42ad7.up.railway.app'}/cancel.html\`,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

// Success page
app.get('/success.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(successPageHTML);
});

// Cancel page
app.get('/cancel.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(cancelPageHTML);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'AI Auto-Clipper API is running!',
    status: 'online'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
