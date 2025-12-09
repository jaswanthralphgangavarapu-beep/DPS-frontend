// src/myorderscomponent/MyOrders.jsx
import { useState, useMemo, useEffect } from "react";
import "../myorderscomponent/myordersdesign.css";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import axios from "axios";

const my_order_url = "http://195.35.45.56:6161/api/v2";

const MyOrders = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState("account");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ name: "Guest", phone: "" });
  const [loading, setLoading] = useState(true);

  // Get userId from cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Fetch user data from backend using userId cookie
  useEffect(() => {
    document.body.classList.add("hide-navbar-on-mobile");

    const userId = getCookie("userId");
    if (userId) {
      axios
        .get(`${my_order_url}/users/${userId}`)
        .then((res) => {
          const userData = res.data;
          setUser({
            name: userData.name || "User",
            phone: userData.phoneNumber || "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setUser({ name: "Guest", phone: "" });
        })
        .finally(() => setLoading(false));
    } else {
      setUser({ name: "Guest", phone: "" });
      setLoading(false);
    }

    // Load orders from localStorage (you can later move this to backend too)
    const saved = JSON.parse(localStorage.getItem("userOrders") || "[]");
    setOrders(saved);

    return () => {
      document.body.classList.remove("hide-navbar-on-mobile");
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();
      const hasItemMatching = order.items.some((item) =>
        item.name.toLowerCase().includes(search)
      );
      return (
        search === "" ||
        order.id.toLowerCase().includes(search) ||
        hasItemMatching ||
        order.customer?.name.toLowerCase().includes(search)
      );
    });
  }, [orders, searchTerm]);

  const handleLogout = () => {
    document.cookie = "userId=; Max-Age=0; path=/";
    if (onLogout) onLogout();
    window.location.href = "/";
  };

  const handleMenuClick = (view) => {
    setCurrentView(view);
    setMenuOpen(false);
  };

  return (
    <div className="zebra-account_order_container">
      <div className="eagle-sidebar_header">
        <button className="penguin-hamburger_toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <CiMenuFries />
        </button>
        <div className="lion-profile_title">My Account</div>
      </div>

      <div className={`dolphin-sidebar_wrapper ${menuOpen ? "dolphin-sidebar_open" : ""}`}>
        <div className="tiger-profile_section">
          <div className="panda-profile_info">
            <div className="cheetah-profile_name">
              {loading ? "Loading..." : user.name}
            </div>
            <div className="leopard-profile_phone">
              {loading ? "" : user.phone ? `+91 ${user.phone}` : "Not registered"}
            </div>
          </div>
        </div>

        <nav className="butterfly-menu_container">
          <button
            className={`fox-menu_item ${currentView === "account" ? "fox-menu_active" : ""}`}
            onClick={() => handleMenuClick("account")}
          >
            <span>MY ACCOUNT</span>
          </button>
          <button
            className={`fox-menu_item ${currentView === "orders" ? "fox-menu_active" : ""}`}
            onClick={() => handleMenuClick("orders")}
          >
            <span>MY ORDERS</span>
          </button>
          <button className="fox-menu_item fox-menu_logout" onClick={handleLogout}>
            <span>LOGOUT</span>
          </button>
        </nav>
      </div>

      {/* === MY ACCOUNT VIEW === */}
      {currentView === "account" && (
        <div className="hawk-main_content">
          <div className="parrot-breadcrumb">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="sparrow-breadcrumb_home">Home</span>
            </Link>
            <span className="raven-breadcrumb_separator">›</span>
            <span className="owl-breadcrumb_current">My Account</span>
          </div>

          <div className="phoenix-account_header">
            <h1 className="swan-greeting_text">
              Hello, {loading ? "..." : user.name}!
            </h1>
          </div>

          <div className="peacock-account_section">
            <div className="crow-section_header">
              <h2>PERSONAL INFORMATION</h2>
              <button className="hummingbird-edit_btn" disabled>Edit</button>
            </div>
            <div className="finch-info_card">
              <div className="albatross-info_row">
                <div className="canary-info_column">
                  <label>Name</label>
                  <p className="cardinal-info_value">{loading ? "Loading..." : user.name}</p>
                </div>
              </div>
              <div className="albatross-info_row">
                <div className="canary-info_column">
                  <label>Mobile Number</label>
                  <p className="cardinal-info_value">
                    {loading ? "Loading..." : user.phone ? `+91 ${user.phone}` : "Not added"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === MY ORDERS VIEW (UNCHANGED) === */}
      {currentView === "orders" && (
        <div className="hawk-main_content">
          <div className="parrot-breadcrumb">
            <span className="sparrow-breadcrumb_home">Home</span>
            <span className="raven-breadcrumb_separator">›</span>
            <span className="owl-breadcrumb_current">My Orders</span>
          </div>

          <div className="mongoose-orders_header">
            <h1>MY ORDERS</h1>
          </div>

          <div className="jackal-search_section">
            <input
              type="text"
              className="badger-search_input"
              placeholder="Search Order"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="vulture-empty_state">
              <div className="lynx-empty_icon">Package</div>
              <p className="meerkat-empty_text">Uh-oh, no orders found</p>
              <button className="cobra-reset_filters_btn" onClick={() => setSearchTerm("")}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="squirrel-orders_list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="koala-order_card">
                  <div className="giraffe-order_header">
                    <div className="zebra-order_id_brand">
                      <span className="porcupine-order_id">{order.id}</span>
                      <span className="hedgehog-order_brand">
                        {order.items.length} Item{order.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <span
                      className={`sloth-order_status sloth-status_${order.status
                        .toLowerCase()
                        .replace(" ", "_")}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="antelope-order_product">
                    <span className="gazelle-product_name">
                      {order.items[0].name}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </span>
                    <span className="wildebeest-product_amount">₹{order.total.toLocaleString()}</span>
                  </div>

                  <div className="camel-order_tracking">
                    <div className="bison-tracking_item">
                      <span className="elk-tracking_label">Tracking:</span>
                      <span className="moose-tracking_number">{order.tracking}</span>
                    </div>
                    <div className="bison-tracking_item">
                      <span className="elk-tracking_label">Expected Delivery:</span>
                      <span className="deer-tracking_date">{order.deliveryDate}</span>
                    </div>
                  </div>

                  <div className="buffalo-order_dates">
                    <span className="impala-date_item">Order: {order.orderDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="emu-continue_shopping_btn" onClick={() => (window.location.href = "/")}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;