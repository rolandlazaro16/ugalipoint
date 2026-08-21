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

const LogoIcon = () => (
  <svg 
    width="42" 
    height="42" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="brand-logo-svg"
  >
    {/* Outer plate circle with warm sunset gradient */}
    <circle cx="50" cy="50" r="46" stroke="url(#plateGradient)" strokeWidth="6" fill="url(#plateFill)" />
    <circle cx="50" cy="50" r="38" stroke="url(#plateInnerGradient)" strokeWidth="1.5" />
    
    {/* Ugali Mound (Large soft dome in the upper-left/center) */}
    <circle cx="45" cy="42" r="18" fill="url(#ugaliGradient)" stroke="#e5e7eb" strokeWidth="1.5" />
    
    {/* Chili Sauce/Lemon Bowl (Centered, lower) */}
    <circle cx="48" cy="62" r="9" fill="url(#sauceGradient)" stroke="#ea580c" strokeWidth="2" />
    {/* Seeds inside the bowl */}
    <circle cx="45" cy="60" r="1" fill="#fef08a" />
    <circle cx="51" cy="60" r="1" fill="#fef08a" />
    <circle cx="48" cy="64" r="1" fill="#fef08a" />
    
    {/* Fresh Green Herbs/Leaves (Left side of the bowl) */}
    <path d="M38 52 C30 50 28 58 38 60 Z" fill="url(#leafGradient)" stroke="#15803d" strokeWidth="1.2" />
    <path d="M38 60 C32 62 30 70 38 70 Z" fill="url(#leafGradient)" stroke="#15803d" strokeWidth="1.2" />
    
    {/* Dagaa Fish / Sauce Drizzle (Wavy line flowing on the right side) */}
    <path d="M64 26 Q74 36 64 46 T74 66" stroke="url(#dagaaLineGradient)" strokeWidth="3.5" strokeLinecap="round" />
    
    {/* Dagaa chunks / Crispy cubes (Bottom right) */}
    <rect x="58" y="70" width="7" height="7" rx="2" transform="rotate(15 58 70)" fill="url(#crispyGradient)" stroke="#c2410c" strokeWidth="1.2" />
    <rect x="68" y="66" width="6" height="6" rx="2" transform="rotate(45 68 66)" fill="url(#crispyGradient)" stroke="#c2410c" strokeWidth="1.2" />
    
    {/* Steam / Aroma lines (Rising from Ugali) */}
    <path d="M42 21 Q40 16 44 12" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M48 21 Q46 17 50 13" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

    {/* Gradients */}
    <defs>
      <linearGradient id="plateGradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="plateFill" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#fffaf0" />
        <stop offset="100%" stopColor="#ffedd5" />
      </linearGradient>
      <linearGradient id="plateInnerGradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="ugaliGradient" x1="25" y1="22" x2="65" y2="62">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f3f4f6" />
      </linearGradient>
      <linearGradient id="sauceGradient" x1="38" y1="52" x2="58" y2="72">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id="leafGradient" x1="28" y1="50" x2="38" y2="70">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <linearGradient id="dagaaLineGradient" x1="60" y1="20" x2="80" y2="70">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="crispyGradient" x1="58" y1="65" x2="75" y2="75">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
  </svg>
);

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
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

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

    const savedName = localStorage.getItem("user_profile_name");
    const savedPhone = localStorage.getItem("user_profile_phone");
    const savedLocation = localStorage.getItem("user_profile_location");
    if (savedName && savedPhone && savedLocation) {
      setName(savedName);
      setPhone(savedPhone);
      setLocation(savedLocation);
      setIsProfileSaved(true);
    }
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

    // Save profile to local storage and set saved state
    localStorage.setItem("user_profile_name", name.trim());
    localStorage.setItem("user_profile_phone", phone.trim());
    localStorage.setItem("user_profile_location", location.trim());
    setIsProfileSaved(true);

    // Show popup
    setShowOrderPopup(true);

    // Reset only the quantity counter (keep name/phone/location for next orders)
    setQuantity(1);
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
      setShowPassword(false);
    } else {
      setLoginError("Namba ya simu au neno la siri sio sahihi!");
    }
  };

  const handleChefClick = () => {
    if (isChefAuthenticated) {
      setView("chef");
    } else {
      setShowChefLogin(true);
      setShowPassword(false);
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
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={chefPassword}
                    onChange={(e) => setChefPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ficha Neno la Siri" : "Onyesha Neno la Siri"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowChefLogin(false); setShowPassword(false); }}>
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
        <div className="brand-container" onClick={() => setView("home")} style={{ cursor: "pointer" }}>
          <LogoIcon />
          <div className="brand-text-group">
            <span className="brand-name">Ugali Point</span>
            <span className="brand-tagline">Hot Ugali. Fresh Dagaa. Simple & Delicious.</span>
          </div>
        </div>
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
          🛒 My Order ({orders.length})
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
            </div>

            {/* Product Details Block */}
            <div className="product-details-container">
              <h2 className="product-title">Ugali Wa Kipekee na Dagaa Watamu</h2>
              <div className="product-badges">
                <span className="badge-item">Fresh</span>
                <span className="badge-dot">•</span>
                <span className="badge-item">Hot</span>
                <span className="badge-dot">•</span>
                <span className="badge-item">Traditional</span>
              </div>
              <div className="product-price">Tsh 1,000</div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrderSubmit} className="order-form">
              {isProfileSaved ? (
                <div className="saved-profile-stepper-container">
                  <div className="saved-profile-info-summary">
                    <span className="summary-text">Oda hii itatumwa kwa <strong>{name}</strong> ({phone}, {location})</span>
                    <button 
                      type="button" 
                      className="btn-edit-profile" 
                      onClick={() => setIsProfileSaved(false)}
                      title="Badili Taarifa"
                    >
                      Badili Taarifa
                    </button>
                  </div>
                  <div className="form-group quantity-only-group">
                    <label>Quantity</label>
                    <div className="quantity-stepper">
                      <button 
                        type="button" 
                        className="stepper-btn" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </button>
                      <span className="stepper-val">{quantity}</span>
                      <button 
                        type="button" 
                        className="stepper-btn" 
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
                    <label>Quantity</label>
                    <div className="quantity-stepper">
                      <button 
                        type="button" 
                        className="stepper-btn" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </button>
                      <span className="stepper-val">{quantity}</span>
                      <button 
                        type="button" 
                        className="stepper-btn" 
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
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
              )}

              <button type="submit" className="btn-order-now">
                ORDER NOW — Tsh {(quantity * 1000).toLocaleString()}
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
