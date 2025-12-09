import { useState } from 'react';
import '../supportcomponent/designsupport.css';

const SupportPage = () => {
  const [activeCategory, setActiveCategory] = useState('order');
  const [expandedItems, setExpandedItems] = useState({});

  const categories = [
    { id: 'order', name: 'Order & Payment', icon: '✦' },
    { id: 'tracking', name: 'Order Tracking', icon: '✈' },
    { id: 'returns', name: 'Refunds & Returns', icon: '↻' },
    { id: 'misc', name: 'General Queries', icon: '❖' }
  ];

  const faqs = {
    order: [
      { id: 1, q: "How do I know my order is confirmed?", a: "You’ll receive an instant confirmation via email and SMS with your order number, details, and payment receipt." },
      { id:2, q: "What payment methods do you accept?", a: "We accept all major cards, UPI, net banking, wallets (PhonePe, Paytm, Google Pay), and EMI options." },
      { id:3, q: "Are there any hidden charges?", a: "Absolutely none. Taxes, shipping, and all fees are shown transparently before checkout." },
      { id:4, q: "My payment failed but money was deducted?", a: "Don’t worry — the amount will auto-refund within 3–5 business days. Contact us with your transaction ID for instant help." },
      { id:5, q: "Can I modify my order after placing it?", a: "Yes! Within 15 minutes of placing the order, reach out to us via chat or call — we’ll update it instantly." }
    ],
    tracking: [
      { id:6, q: "How can I track my order?", a: "Check real-time status in your account dashboard or use the tracking link sent via email/SMS." },
      { id:7, q: "When will my order be delivered?", a: "Standard delivery: 3–7 days | Express: 1–2 days (available in 18,000+ pincodes)." }
    ],
    returns: [
      { id:8, q: "What is your return policy?", a: "30-day hassle-free returns. Item must be unused with original packaging." },
      { id:9, q: "How do I initiate a return?", a: "Log in → My Orders → Select item → Click 'Return' → Schedule free pickup (free)." },
      { id:10, q: "When will I get my refund?", a: "Refunds are processed within 48 hours of pickup. You’ll receive it in 3–5 business days." }
    ],
    misc: [
      { id:11, q: "Do you have physical stores?", a: "Yes! Visit our flagship stores in Mumbai, Delhi, Bangalore & more. Find locations here." },
      { id:12, q: "Can I place an order over phone?", a: "Absolutely. Call our VIP concierge at +91 81255 05568 — available 24×7." }
    ]
  };

  const currentFaqs = faqs[activeCategory] || [];

  const toggleFaq = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="luxury-support">
      {/* Hero Header */}
      <header className="lux-hero">
        <div className="lux-overlay"></div>
        <div className="lux-content">
          <h1 className="lux-title">We're Here for You</h1>
          <p className="lux-subtitle">Premium Support • 24×7 • Always Personal</p>
        </div>
        <div className="glow-line"></div>
      </header>

      {/* Contact Cards - Luxury Glassmorphism */}
      <section className="lux-contact-section">
        <div className="lux-container">
          <div className="lux-grid">
            <div className="lux-card glass">
              <div className="icon">☎</div>
              <h3>Call Our VIP Line</h3>
              <p className="highlight">+91 81255 05568</p>
              <p>24×7 • Dedicated Support</p>
            </div>

            <div className="lux-card glass">
              <div className="icon">✉</div>
              <h3>Live Chat with Us</h3>
              <p className="highlight">Average response: 8 seconds</p>
               
            </div>

            <div className="lux-card glass">
              <div className="icon">✈</div>
              <h3>Store & Delivery Queries</h3>
              <p className="highlight">theedrip.co@gmail.com</p>
              <p>Expect reply within 1 hour</p>
            </div>

            <div className="lux-card glass gold-border">
              <div className="icon">⭐</div>
              <h3>Grievance Officer</h3>
              <a href="mailto:theedrip.co@gmail.com" className="gold-link">Contact Directly →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories + FAQ */}
      <section className="lux-faq-section">
        <div className="lux-container">
          <h2 className="section-title">How Can We Assist You Today?</h2>

          <div className="faq-layout">
            {/* Sidebar */}
            <aside className="category-sidebar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span>{cat.name}</span>
                  {activeCategory === cat.id && <span className="active-bar"></span>}
                </button>
              ))}
            </aside>

            {/* FAQ List */}
            <div className="faq-list">
              {currentFaqs.map(item => (
                <div key={item.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(item.id)}
                  >
                    <span>{item.q}</span>
                    <span className={`arrow ${expandedItems[item.id] ? 'rotated' : ''}`}>↓</span>
                  </button>
                  {expandedItems[item.id] && (
                    <div className="faq-answer animate-in">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       
    </div>
  );
};

export default SupportPage;