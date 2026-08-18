"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  itemId: string;
  title: string;
  price: number;
  portion: string;
  pepperLevel: string;
  ugaliType: string;
  quantity: number;
}

interface MenuItem {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  category: "dagaa" | "drinks";
  badges: string[];
  hasUgali: boolean;
  hasPepper: boolean;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "dagaa-fried",
    title: "Dagaa wa Kukaanga Special (Fried)",
    description: "Crispy deep-fried fresh Lake Victoria sardines, sautéed local leafy greens (kisamvu/mchicha), ripe tomatoes, red onions, and hot green pepper salad. Served with a piping hot block of our signature Cassava and Cereal Grains Ugali.",
    basePrice: 8500,
    category: "dagaa",
    badges: ["🏆 Bestseller", "🐟 Fresh Catch", "🌶️ Custom Spice"],
    hasUgali: true,
    hasPepper: true,
  },
  {
    id: "dagaa-stewed",
    title: "Dagaa wa Mchuzi Special (Stewed)",
    description: "Savory simmered fresh Lake Victoria sardines in a rich, aromatic tomato, garlic, onion, and herb reduction. Served with sautéed local greens and a hot block of our signature Cassava and Cereal Grains Ugali.",
    basePrice: 9000,
    category: "dagaa",
    badges: ["🔥 Slow Cooked", "🍲 Savory Gravy"],
    hasUgali: true,
    hasPepper: true,
  },
  {
    id: "madafu",
    title: "Madafu ya Baridi",
    description: "Freshly harvested organic coconut water served ice-cold inside the whole green coconut shell. The ultimate refreshing hydrator.",
    basePrice: 3500,
    category: "drinks",
    badges: ["🥥 Natural", "🧊 Served Cold"],
    hasUgali: false,
    hasPepper: false,
  },
  {
    id: "chai-tangawizi",
    title: "Chai ya Tangawizi (Spiced Tea)",
    description: "Authentic hot black tea brewed with fresh, crushed local ginger root, lemongrass, and cardamom. Perfect for digestion.",
    basePrice: 2000,
    category: "drinks",
    badges: ["☕ Hot Brew", "🌱 Immune Boost"],
    hasUgali: false,
    hasPepper: false,
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Amani Mwangi",
    rating: 5,
    comment: "The Fried Dagaa is absolute perfection! Reminds me exactly of the fish from Lake Victoria. The Cassava and Cereal Grains Ugali is the perfect texture.",
    date: "2 hours ago"
  },
  {
    id: "rev-2",
    name: "Sarah Peterson",
    rating: 5,
    comment: "The Dagaa wa Mchuzi (stewed) is rich, aromatic and full of flavor. The delivery was fast and it arrived piping hot. Karibu sana indeed!",
    date: "Yesterday"
  },
  {
    id: "rev-3",
    name: "Baraka Juma",
    rating: 4,
    comment: "I love both the fried and stewed versions. Portion sizes are huge, and the greens are cooked just right. 5 stars for the food!",
    date: "3 days ago"
  }
];

export default function Home() {
  // Category Filter
  const [category, setCategory] = useState<"all" | "dagaa" | "drinks">("all");

  // Customization States (keyed by Item ID)
  const [portions, setPortions] = useState<Record<string, string>>({
    "dagaa-fried": "Single",
    "dagaa-stewed": "Single",
  });
  const [peppers, setPeppers] = useState<Record<string, string>>({
    "dagaa-fried": "Medium",
    "dagaa-stewed": "Medium",
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Simulated Order Tracker State
  const [orderStatus, setOrderStatus] = useState<"none" | "received" | "preparing" | "delivery" | "delivered">("none");
  const [driverName, setDriverName] = useState("");
  const [deliveryTimeLeft, setDeliveryTimeLeft] = useState(20);

  // Toasts
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // Live order state machine simulation
  useEffect(() => {
    if (orderStatus === "none") return;

    let timer: NodeJS.Timeout;
    if (orderStatus === "received") {
      timer = setTimeout(() => {
        setOrderStatus("preparing");
        showNotification("👨‍🍳 Kitchen has started preparing your order!");
      }, 5000);
    } else if (orderStatus === "preparing") {
      timer = setTimeout(() => {
        setOrderStatus("delivery");
        const drivers = ["Juma", "Hamisi", "Ally", "Iddi"];
        setDriverName(drivers[Math.floor(Math.random() * drivers.length)]);
        showNotification("🛵 Order is out for delivery with our rider!");
      }, 8000);
    } else if (orderStatus === "delivery") {
      timer = setTimeout(() => {
        setOrderStatus("delivered");
        showNotification("🎉 Your order has been delivered! Karibu sana!");
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [orderStatus]);

  // Countdown timer for delivery
  useEffect(() => {
    if (orderStatus !== "delivery" || deliveryTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setDeliveryTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderStatus, deliveryTimeLeft]);

  const showNotification = (message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const getPrice = (item: MenuItem) => {
    let price = item.basePrice;
    const itemPortion = portions[item.id] || "Single";
    if (itemPortion === "Platter") {
      price += 5000;
    }
    return price;
  };

  const addToCart = (item: MenuItem) => {
    const itemPortion = portions[item.id] || "Single";
    const itemPepper = peppers[item.id] || "Medium";
    const itemUgali = item.hasUgali ? "Cassava and Cereal Grains" : "N/A";
    const finalPrice = getPrice(item);

    // Look for duplicate item with same customizations
    const existingIndex = cart.findIndex(
      (c) =>
        c.itemId === item.id &&
        c.portion === itemPortion &&
        (!item.hasPepper || c.pepperLevel === itemPepper)
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${item.id}`,
        itemId: item.id,
        title: item.title,
        price: finalPrice,
        portion: item.hasUgali ? itemPortion : "Standard",
        pepperLevel: item.hasPepper ? itemPepper : "N/A",
        ugaliType: itemUgali,
        quantity: 1,
      };
      setCart((prev) => [...prev, newItem]);
    }

    showNotification(`🛒 Added ${item.title} to your plate!`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      showNotification("⚠️ Please fill in all delivery details.");
      return;
    }

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setDeliveryTimeLeft(20);
    setOrderStatus("received");
    showNotification("✅ Order placed successfully! Live tracking active.");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      showNotification("⚠️ Please enter a name and comment.");
      return;
    }

    const review: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: "Just now",
    };

    setReviews((prev) => [review, ...prev]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    showNotification("💖 Asante! Thank you for your review.");
  };

  const filteredMenuItems = MENU_ITEMS.filter(
    (item) => category === "all" || item.category === category
  );

  return (
    <>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast show">
            <span>ℹ️</span> {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <span>🍛</span> Ugali Point
          </div>
          <nav>
            <ul className="nav-links">
              <li><a href="#menu" className="nav-link">Menu</a></li>
              <li><a href="#reviews" className="nav-link">Testimonials</a></li>
              <li><a href="#contact" className="nav-link">Location</a></li>
            </ul>
          </nav>
          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            <span style={{ fontSize: "24px" }}>🛒</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1 className="hero-title">Experience the Real Taste of Tanzania</h1>
            <p className="hero-subtitle">
              Savor our signature Dagaa specials from Lake Victoria, served piping hot with our traditional Cassava and Cereal Grains Ugali blend and fresh spicy kachumbari.
            </p>
            <a href="#menu" className="hero-cta">
              Explore Today's Menu ➔
            </a>
          </div>
          <div className="hero-image-container">
            <Image
              src="/dagaa_special.png"
              alt="Dagaa wa Kukaanga na Ugali wa Muhogo"
              width={420}
              height={320}
              className="hero-image"
              priority
            />
          </div>
        </div>
      </section>

      <div className="container">
        {/* Info Bar */}
        <section className="info-bar">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <div className="info-title">Find Us</div>
                <div className="info-text">Kinondoni, Dar es Salaam</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div>
                <div className="info-title">Hours</div>
                <div className="info-text">Daily: 11:00 AM – 11:00 PM</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <div className="info-title">Call & Order</div>
                <div className="info-text">+255 712 345 678</div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Order Tracker */}
        {orderStatus !== "none" && (
          <div className="tracker-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-family-header)", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔴</span> Live Order Status
              </h3>
              <button 
                onClick={() => setOrderStatus("none")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "var(--foreground)", opacity: 0.6 }}
              >
                Dismiss Tracker
              </button>
            </div>
            
            {orderStatus === "delivery" && driverName && (
              <div style={{ margin: "10px 0", fontSize: "14px", padding: "10px", backgroundColor: "rgba(21, 128, 61, 0.05)", borderRadius: "8px", border: "1px solid rgba(21, 128, 61, 0.1)" }}>
                🛵 <strong>Rider:</strong> {driverName} is delivering! | ⏳ Arriving in approx: <strong>{deliveryTimeLeft}s</strong>
              </div>
            )}

            <div className="tracker-steps">
              <div className={`tracker-step ${["received", "preparing", "delivery", "delivered"].includes(orderStatus) ? "active" : ""}`}>
                <div className="tracker-dot">1</div>
                <span>Order Placed</span>
              </div>
              <div className={`tracker-step ${["preparing", "delivery", "delivered"].includes(orderStatus) ? "active" : ""}`}>
                <div className="tracker-dot">2</div>
                <span>Preparing</span>
              </div>
              <div className={`tracker-step ${["delivery", "delivered"].includes(orderStatus) ? "active" : ""}`}>
                <div className="tracker-dot">3</div>
                <span>On The Way</span>
              </div>
              <div className={`tracker-step ${orderStatus === "delivered" ? "active" : ""}`}>
                <div className="tracker-dot">4</div>
                <span>Arrived</span>
              </div>
            </div>
          </div>
        )}

        {/* Menu Section */}
        <section id="menu" className="menu-section">
          <h2 className="section-title">Today's Menu</h2>
          <p className="section-subtitle">Freshly prepared local staples cooked to perfection</p>

          {/* Menu Categories */}
          <div className="category-filters">
            {(["all", "dagaa", "drinks"] as const).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "all" ? "All Items" : cat === "dagaa" ? "Dagaa Specials" : "Refreshments"}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredMenuItems.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-card-image">
                  <Image
                    src="/dagaa_special.png"
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{item.title}</h3>
                  <p className="menu-card-desc">{item.description}</p>

                  <div className="badge-container">
                    {item.badges.map((b) => (
                      <span key={b} className="badge badge-primary">{b}</span>
                    ))}
                    {item.hasUgali && (
                      <span className="badge badge-secondary">🌾 Cassava & Cereal Grains Ugali</span>
                    )}
                  </div>

                  {/* Portion customizer */}
                  {item.hasUgali && (
                    <div className="customizer">
                      <div className="customizer-title">Portion Size</div>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            className="radio-input"
                            name={`portion-${item.id}`}
                            checked={(portions[item.id] || "Single") === "Single"}
                            onChange={() => setPortions({ ...portions, [item.id]: "Single" })}
                          />
                          <span>Single</span>
                          <span style={{ fontSize: "10px", opacity: 0.6 }}>Standard</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            className="radio-input"
                            name={`portion-${item.id}`}
                            checked={(portions[item.id] || "Single") === "Platter"}
                            onChange={() => setPortions({ ...portions, [item.id]: "Platter" })}
                          />
                          <span>Family Platter</span>
                          <span style={{ fontSize: "10px", opacity: 0.6 }}>+5,000 TSh</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Pepper Level */}
                  {item.hasPepper && (
                    <div className="customizer">
                      <div className="customizer-title">Pepper Level (Kachumbari)</div>
                      <div className="radio-group">
                        {["None", "Mild", "Medium", "Kali Sana"].map((level) => (
                          <label key={level} className="radio-label" style={{ padding: "6px" }}>
                            <input
                              type="radio"
                              className="radio-input"
                              name={`pepper-${item.id}`}
                              checked={(peppers[item.id] || "Medium") === level}
                              onChange={() => setPeppers({ ...peppers, [item.id]: level })}
                            />
                            <span style={{ fontSize: "11px" }}>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="menu-card-footer">
                    <div className="price">{getPrice(item).toLocaleString()} TSh</div>
                    <button className="btn-order" onClick={() => addToCart(item)}>
                      Add to Plate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="reviews" className="reviews-section">
          <h2 className="section-title">Customer Feedback</h2>
          <p className="section-subtitle">What local and international food lovers say about our Dagaa staples</p>

          <div className="reviews-grid">
            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div className="review-card" key={rev.id}>
                  <div className="review-header">
                    <span className="reviewer-name">{rev.name}</span>
                    <span className="review-rating">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                  </div>
                  <p className="review-comment">"{rev.comment}"</p>
                  <div style={{ fontSize: "12px", opacity: 0.5, marginTop: "8px", textAlign: "right" }}>
                    {rev.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Review submission Form */}
            <div className="review-form-container">
              <h3 style={{ marginBottom: "15px", fontFamily: "var(--font-family-header)" }}>Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Neema Mwajuma"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="rating-select">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        className={`star-btn ${newReviewRating >= stars ? "active" : ""}`}
                        onClick={() => setNewReviewRating(stars)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    style={{ resize: "none" }}
                    placeholder="Write details of the food, seasoning, and delivery service..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-checkout" style={{ padding: "12px" }}>
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Cart Drawer Backdrop */}
      <div className={`cart-backdrop ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)} />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3 style={{ fontFamily: "var(--font-family-header)" }}>Your Order Plate</h3>
          <button className="btn-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.6 }}>
              <span style={{ fontSize: "56px", display: "block", marginBottom: "16px" }}>🍽️</span>
              Your plate is empty. Add hot Dagaa specials from our menu to start!
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-customization">
                    Portion: {item.portion} | Pepper: {item.pepperLevel} <br />
                    Ugali: {item.ugaliType}
                  </div>
                  <div className="cart-item-price">
                    {(item.price * item.quantity).toLocaleString()} TSh
                  </div>
                </div>
                
                {/* Quantity Control Buttons */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div className="quantity-control">
                    <button className="quantity-btn" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                    <span className="quantity-val">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                  </div>
                  <button
                    onClick={() => updateCartQuantity(item.id, -item.quantity)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Amount:</span>
              <span>{getCartTotal().toLocaleString()} TSh</span>
            </div>
            <button className="btn-checkout" onClick={() => setIsCheckoutOpen(true)}>
              Proceed to Delivery Details
            </button>
          </div>
        )}
      </div>

      {/* Checkout Details Modal */}
      <div className={`modal-backdrop ${isCheckoutOpen ? "open" : ""}`} onClick={() => setIsCheckoutOpen(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 style={{ fontFamily: "var(--font-family-header)" }}>🛵 Enter Delivery Details</h3>
            <button className="btn-close" onClick={() => setIsCheckoutOpen(false)}>✕</button>
          </div>
          <form onSubmit={handleCheckoutSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Juma Kassim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tanzanian Phone Number</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="e.g. +255 712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address / Block</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Kinondoni, Mwananyamala Road, House #4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "24px" }}>
                <h4 style={{ marginBottom: "12px", fontFamily: "var(--font-family-header)", borderBottom: "1px solid var(--color-border)", paddingBottom: "8px" }}>Order Summary</h4>
                {cart.map((item) => (
                  <div key={item.id} className="checkout-summary-item">
                    <span>{item.title} ({item.quantity}x)</span>
                    <span>{(item.price * item.quantity).toLocaleString()} TSh</span>
                  </div>
                ))}
                <div className="checkout-summary-total">
                  <span>Grand Total:</span>
                  <span>{getCartTotal().toLocaleString()} TSh</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-checkout" style={{ width: "auto" }}>
                Confirm & Place Order
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Section */}
      <footer id="contact" style={{ backgroundColor: "var(--color-dark)", color: "white", padding: "60px 0 40px 0", marginTop: "80px" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
          <div>
            <h3 style={{ color: "var(--color-primary)", marginBottom: "15px" }}>Ugali Point</h3>
            <p style={{ fontSize: "14px", opacity: 0.7, maxWidth: "350px", lineHeight: "1.6" }}>
              Bringing authentic, fresh Tanzanian coastal and lake-zone flavors directly to your home in Dar es Salaam.
            </p>
          </div>
          <div>
            <h4 style={{ color: "white", marginBottom: "15px" }}>Address & Reach</h4>
            <p style={{ fontSize: "14px", opacity: 0.7, lineHeight: "1.8" }}>
              📍 Kinondoni B, near Morocco Bus Station<br />
              📞 Call Orders: +255 712 345 678<br />
              📧 Email: karibu@ugalipoint.co.tz
            </p>
          </div>
          <div style={{ minWidth: "120px" }}>
            <h4 style={{ color: "white", marginBottom: "15px" }}>Staples</h4>
            <ul style={{ listStyle: "none", fontSize: "14px", opacity: 0.7, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Dagaa wa Kukaanga</li>
              <li>Dagaa wa Mchuzi</li>
              <li>Cassava & Cereal Grains Ugali</li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "13px", opacity: 0.5, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <span>© {new Date().getFullYear()} Ugali Point. All rights reserved.</span>
          <span>Made with ❤️ in Dar es Salaam</span>
        </div>
      </footer>
    </>
  );
}
