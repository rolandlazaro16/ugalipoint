"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Order {
  id: string;
  name: string;
  phone: string;
  quantity: number;
  time: string;
  status: "Received" | "Preparing" | "On the Way" | "Delivered";
}

export default function Home() {
  const [view, setView] = useState<"home" | "orders">("home");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ugalipoint_orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showNotification = (message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || quantity <= 0) {
      showNotification("⚠️ Tafadhali jaza taarifa zote kwa usahihi.");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      name,
      phone,
      quantity,
      time: new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" }),
      status: "Received"
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("ugalipoint_orders", JSON.stringify(updatedOrders));

    showNotification("✅ Oda yako imepokelewa! Karibu sana.");
    setName("");
    setPhone("");
    setQuantity(1);
    setView("orders"); // Switch to My Order view to show requested order
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast show">
            <span>ℹ️</span> {t.message}
          </div>
        ))}
      </div>

      {/* Top Header */}
      <header className="top-header">
        <div className="logo-circle">
          <span>🍛</span>
        </div>
        <div className="profile-circle" title="User Profile">
          <span>👤</span>
        </div>
      </header>

      {/* Navigation Buttons Row */}
      <div className="nav-row">
        <button 
          className={`nav-btn ${view === "home" ? "active" : ""}`}
          onClick={() => setView("home")}
        >
          Home
        </button>
        <button 
          className={`nav-btn ${view === "orders" ? "active" : ""}`}
          onClick={() => setView("orders")}
        >
          My Order ({orders.length})
        </button>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        {view === "home" ? (
          <div className="home-view fade-in">
            {/* Food Plate Picture */}
            <div className="food-image-container">
              <Image
                src="/home_plate.jpg"
                alt="Ugali, Dagaa wa Kuchoma, Pilipili, Mboga na Ndimu"
                width={500}
                height={400}
                className="food-plate-image"
                priority
              />
              <div className="image-overlay">
                <h3>Dagaa Special & Ugali wa Moto</h3>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrderSubmit} className="order-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name-input">Name</label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="Jina lako"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone-input">Phone Number</label>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="Namba ya simu"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group quantity-group">
                <label htmlFor="quantity-input">Quantity</label>
                <input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <button type="submit" className="btn-order-now">
                Order Now
              </button>
            </form>
          </div>
        ) : (
          <div className="orders-view fade-in">
            <h2 className="view-title">My Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🍽️</span>
                <p>Hujafanya oda yoyote bado.</p>
                <button className="btn-return-home" onClick={() => setView("home")}>
                  Agiza Sasa
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <span className="order-time">Saa: {order.time}</span>
                      <span className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>Mteja:</strong> {order.name}</p>
                      <p><strong>Simu:</strong> {order.phone}</p>
                      <p><strong>Idadi:</strong> {order.quantity} x Ugali wa Moto na Dagaa</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
