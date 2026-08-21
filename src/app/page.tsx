"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Order {
  id: string;
  name: string;
  phone: string;
  quantity: number;
  location: string;
  date: string;
  time: string;
  status: "Received" | "Confirmed";
}

export default function Home() {
  const [view, setView] = useState<"home" | "orders" | "chef">("home");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Profile Pictures States
  const [userProfilePic, setUserProfilePic] = useState("");
  const [chefProfilePic, setChefProfilePic] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Popups & Auth State
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);
  
  const [showChefLogin, setShowChefLogin] = useState(false);
  const [chefPhone, setChefPhone] = useState("");
  const [chefPassword, setChefPassword] = useState("");
  const [isChefAuthenticated, setIsChefAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Load orders and profile pics on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("ugalipoint_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }

    const savedUserPic = localStorage.getItem("user_profile_pic");
    if (savedUserPic) setUserProfilePic(savedUserPic);

    const savedChefPic = localStorage.getItem("chef_profile_pic");
    if (savedChefPic) setChefProfilePic(savedChefPic);
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("ugalipoint_orders", JSON.stringify(updatedOrders));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !location.trim() || quantity <= 0) {
      alert("Tafadhali jaza taarifa zote kwa usahihi.");
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("sw-TZ", { day: "numeric", month: "short", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" });

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      name,
      phone,
      quantity,
      location,
      date: formattedDate,
      time: formattedTime,
      status: "Received"
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    setLastSubmittedOrder(newOrder);

    // Show popup
    setShowOrderPopup(true);

    // Reset inputs
    setName("");
    setPhone("");
    setQuantity(1);
    setLocation("");
  };

  // Chef Actions
  const handleApproveOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "Confirmed" as const };
      }
      return o;
    });
    saveOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrders(updated);
  };

  const handleChefLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chefPhone.trim() === "0675217216" && chefPassword === "muro2548") {
      setIsChefAuthenticated(true);
      setShowChefLogin(false);
      setView("chef");
      setChefPhone("");
      setChefPassword("");
      setLoginError("");
    } else {
      setLoginError("Namba ya simu au neno la siri sio sahihi!");
    }
  };

  const handleChefClick = () => {
    if (isChefAuthenticated) {
      setView("chef");
    } else {
      setShowChefLogin(true);
    }
  };

  const handleChefLogout = () => {
    setIsChefAuthenticated(false);
    setView("home");
  };

  // Profile Picture Upload Handler
  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>, role: "user" | "chef") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        if (role === "user") {
          setUserProfilePic(data.url);
          localStorage.setItem("user_profile_pic", data.url);
        } else {
          setChefProfilePic(data.url);
          localStorage.setItem("chef_profile_pic", data.url);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Kupakia picha kulifeli. Tafadhali jaribu tena.");
    } finally {
      setIsUploading(false);
    }
  };

  const currentOrders = orders.filter((o) => o.status === "Received");
  const previousOrders = orders.filter((o) => o.status === "Confirmed");

  return (
    <div className="app-container">
      {/* custom order submitted popup */}
      {showOrderPopup && (
        <div className="popup-backdrop">
          <div className="popup-box fade-in">
            <span className="popup-icon">🎉</span>
            <h2>Order submitted</h2>
            {lastSubmittedOrder && (
              <div className="popup-details">
                <p><strong>Mteja:</strong> {lastSubmittedOrder.name}</p>
                <p><strong>Simu:</strong> {lastSubmittedOrder.phone}</p>
                <p><strong>Idadi:</strong> {lastSubmittedOrder.quantity} x Ugali wa Moto na Dagaa</p>
                <p><strong>Mahali:</strong> {lastSubmittedOrder.location}</p>
                <p className="popup-time">{lastSubmittedOrder.date} saa {lastSubmittedOrder.time}</p>
              </div>
            )}
            <button 
              className="btn-popup-close" 
              onClick={() => {
                setShowOrderPopup(false);
                setView("orders"); // Switch to My Order view to show requested order
              }}
            >
              Sawa
            </button>
          </div>
        </div>
      )}

      {/* Chief Cooker Login Modal */}
      {showChefLogin && (
        <div className="popup-backdrop">
          <div className="popup-box login-box fade-in">
            <span className="popup-icon">👨‍🍳</span>
            <h2>Chief Cooker Login</h2>
            <form onSubmit={handleChefLoginSubmit} className="chef-login-form">
              {loginError && <p className="error-message">{loginError}</p>}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0675217216"
                  value={chefPhone}
                  onChange={(e) => setChefPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={chefPassword}
                  onChange={(e) => setChefPassword(e.target.value)}
                  required
                />
              </div>
              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowChefLogin(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Ingia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="top-header">
        <div className="logo-circle" onClick={() => setView("home")} style={{ cursor: "pointer" }}>
          <span>🍛</span>
        </div>
        <h1 className="app-title" onClick={() => setView("home")} style={{ cursor: "pointer" }}>Ugali Point</h1>
        <div className="header-profiles">
          <button 
            className={`chef-profile-btn ${view === "chef" ? "active" : ""}`}
            onClick={handleChefClick}
            title="Chief Cooker Dashboard"
          >
            {chefProfilePic ? (
              <img src={chefProfilePic} alt="Chef Profile" className="chef-header-img" />
            ) : (
              <span>👨‍🍳 Chef</span>
            )}
          </button>
          <div 
            className={`profile-circle ${view === "orders" ? "active" : ""}`} 
            onClick={() => setView("orders")}
            title="My Orders"
          >
            {userProfilePic ? (
              <img src={userProfilePic} alt="User Profile" className="user-header-img" />
            ) : (
              <span>👤</span>
            )}
          </div>
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
                <div className="form-group">
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
                <div className="form-group">
                  <label htmlFor="location-input">Location</label>
                  <input
                    id="location-input"
                    type="text"
                    placeholder="Mahali unapoishi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-order-now">
                Order Now
              </button>
            </form>
          </div>
        ) : view === "orders" ? (
          <div className="orders-view fade-in">
            {/* Profile Pic Card in User Profile View */}
            <div className="profile-section-card">
              <div className="profile-avatar-container">
                {userProfilePic ? (
                  <img src={userProfilePic} alt="User Avatar" className="profile-avatar-img" />
                ) : (
                  <span className="profile-avatar-placeholder">👤</span>
                )}
                <label className="upload-avatar-label">
                  {isUploading ? "..." : "Badili"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfilePicUpload(e, "user")}
                    style={{ display: "none" }}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div className="profile-text">
                <h3>Wasifu wa Mteja</h3>
                <p>Pakia picha yako hapa ili ionekane kwenye wasifu wako.</p>
              </div>
            </div>

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
                      <span className="order-time">{order.date} saa {order.time}</span>
                      <span className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status === "Received" ? "Inapitiwa" : "Imethibitishwa"}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>Mteja:</strong> {order.name}</p>
                      <p><strong>Simu:</strong> {order.phone}</p>
                      <p><strong>Idadi:</strong> {order.quantity} x Ugali wa Moto na Dagaa</p>
                      <p><strong>Mahali:</strong> {order.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Chief Cooker Dashboard View */
          <div className="chef-view fade-in">
            {/* Profile Pic Card in Chef View */}
            <div className="profile-section-card chef-theme">
              <div className="profile-avatar-container">
                {chefProfilePic ? (
                  <img src={chefProfilePic} alt="Chef Avatar" className="profile-avatar-img" />
                ) : (
                  <span className="profile-avatar-placeholder">👨‍🍳</span>
                )}
                <label className="upload-avatar-label">
                  {isUploading ? "..." : "Badili"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfilePicUpload(e, "chef")}
                    style={{ display: "none" }}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div className="profile-text">
                <h3>Chef Profile 👨‍🍳</h3>
                <p>Pakia picha yako ya Uchef ili ionekane kwenye dashibodi.</p>
              </div>
            </div>

            <div className="chef-view-header">
              <h2 className="view-title">Chef Dashboard</h2>
              <button className="btn-chef-logout" onClick={handleChefLogout}>
                Logout
              </button>
            </div>
            <div className="dashboard-grid">
              
              {/* Left Column: Current Order */}
              <div className="dashboard-column">
                <h3 className="column-title label-current">Current Order</h3>
                <div className="orders-list">
                  {currentOrders.length === 0 ? (
                    <p className="no-orders-msg">Hakuna oda mpya kwa sasa.</p>
                  ) : (
                    currentOrders.map((order) => (
                      <div key={order.id} className="chef-order-card">
                        <div className="chef-order-time">
                          <span>📅 {order.date}</span>
                          <span>⏰ {order.time}</span>
                        </div>
                        <div className="chef-order-details">
                          <p><strong>Mteja:</strong> {order.name}</p>
                          <p><strong>Simu:</strong> {order.phone}</p>
                          <p><strong>Idadi:</strong> {order.quantity} x Ugali wa Moto</p>
                          <p><strong>Mahali:</strong> {order.location}</p>
                        </div>
                        <div className="chef-order-actions">
                          <button 
                            className="btn-chef-approve"
                            onClick={() => handleApproveOrder(order.id)}
                          >
                            Confirm
                          </button>
                          <button 
                            className="btn-chef-delete"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Previous Order */}
              <div className="dashboard-column">
                <h3 className="column-title label-previous">Previous Order</h3>
                <div className="orders-list">
                  {previousOrders.length === 0 ? (
                    <p className="no-orders-msg">Hakuna oda zilizopita bado.</p>
                  ) : (
                    previousOrders.map((order) => (
                      <div key={order.id} className="chef-order-card previous">
                        <div className="chef-order-time">
                          <span>📅 {order.date}</span>
                          <span>⏰ {order.time}</span>
                        </div>
                        <div className="chef-order-details">
                          <p><strong>Mteja:</strong> {order.name}</p>
                          <p><strong>Simu:</strong> {order.phone}</p>
                          <p><strong>Idadi:</strong> {order.quantity} x Ugali wa Moto</p>
                          <p><strong>Mahali:</strong> {order.location}</p>
                        </div>
                        <div className="chef-order-actions">
                          <button 
                            className="btn-chef-delete"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
