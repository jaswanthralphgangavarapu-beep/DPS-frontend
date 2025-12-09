// Productpagemainwrapper.jsx
import { useState, useEffect, useRef } from "react";
import "../productsenlargecomponent/productspagedesign.css";
import { CiShoppingCart } from "react-icons/ci";
import { FaTruck, FaSync, FaStore, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ReutrnsCode from "../returnscomponent/returnscode";
import { Link } from "react-router-dom";
import DripLoginPopup from "../usercredentialscomponent/loginpopup.jsx";
import { getUserIdFromCookie, setUserLoggedIn } from "../usercredentialscomponent/logincookieauth.js";

const API_BASE = "http://195.35.45.56:4646";

const Productpagemainwrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, syncCartOnLogin } = useCart();
  const product = location.state?.product;

  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSizeToast, setShowSizeToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }

    const userId = getUserIdFromCookie();
    setIsLoggedIn(!!userId);
    setIsLoading(false);
  }, [product, navigate]);

  if (!product) return null;

  // Images logic
  const mainImage = product.mainImage || (product.images && product.images[0]) || "https://via.placeholder.com/600x800/222/fff?text=NO+IMAGE";
  const gallery = product.gallery || [];
  const img1 = mainImage;
  const img2 = gallery[0] || mainImage;
  const img3 = gallery[1] || mainImage;
  const img4 = gallery[2] || mainImage;

  const allImages = [img1, img2, img3, img4].filter((img, i, arr) => arr.indexOf(img) === i);

  // Universal data
  const title = product.title || product.name || "Untitled Product";
  const currentPrice = Number.parseFloat(product.price || product.currentPrice || 0);
  const previousPrice = Number.parseFloat(product.previousPrice || product.originalPrice || 0);
  const description = product.description || "Premium quality streetwear from DripCo.";
  const stock = product.stock !== undefined ? product.stock : 999;
  const discount = previousPrice > currentPrice ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100) : null;

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleActionClick = (action = "bag") => {
    if (isLoading) return;
    if (!selectedSize) {
      setShowSizeToast(true);
      setTimeout(() => setShowSizeToast(false), 3000);
      return;
    }

    if (isLoggedIn) {
      addToCartDirectly();
      if (action === "buy") navigate("/checkout");
    } else {
      setShowLoginPopup(true);
    }
  };

  const addToCartDirectly = () => {
    addToCart({
      id: product.id || Date.now(),
      productId: product.productId || product.id?.toString() || `PROD-${Date.now()}`,
      name: title,
      price: currentPrice,
      size: selectedSize,
      image: mainImage,
      category: product.category || "General",
      quantity: 1,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleRegisterSuccess = (userId) => {
    setUserLoggedIn(userId);
    setIsLoggedIn(true);
    setShowLoginPopup(false);
    if (syncCartOnLogin) syncCartOnLogin(userId);
    addToCartDirectly();
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${title} on DripCo! Only ₹${currentPrice}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  return (
    <>
      <br /><br /><br /><br />

      <div className="tuple_nation_product_wrapper">

        {/* ========== MOBILE SLIDER (≤768px) ========== */}
        <div className="tuple_nation_mobile_slider">
          <div
            ref={sliderRef}
            className="tuple_nation_slider_inner"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="tuple_nation_slide">
                <img src={img} alt={`Slide ${idx + 1}`} className="tuple_nation_mobile_image" />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="tuple_nation_slider_dots">
            {allImages.map((_, idx) => (
              <span
                key={idx}
                className={`tuple_nation_dot ${currentSlide === idx ? "tuple_nation_dot_active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>

        {/* ========== MOBILE PURCHASE PANEL (Only on Mobile) ========== */}
        <div className="tuple_nation_mobile_purchase_panel">
          <div className="tuple_nation_header_section_jackal" style={{ padding: "1rem 1rem 0" }}>
            <h1 className="tuple_nation_product_title_meerkat">{title}</h1>
            <button onClick={shareOnWhatsApp} className="tuple_nation_share_btn_otter">
              <IoIosShareAlt size={24} color="#000000" />
            </button>
          </div>

          <div style={{ padding: "0 1rem" }}>
            <div className="tuple_nation_pricing_section_puma">
              <span className="tuple_nation_price_label_camel">MRP</span>
              {previousPrice > 0 && (
                <span className="tuple_nation_price_original_flamingo">₹ {previousPrice.toLocaleString()}</span>
              )}
              <span className="tuple_nation_price_current_leopard">₹ {currentPrice.toLocaleString()}</span>
              {discount && <span className="tuple_nation_discount_badge_ostrich">{discount}% OFF</span>}
            </div>

            <div className="tuple_nation_size_section_hummingbird" style={{ margin: "1.5rem 0" }}>
              <div className="tuple_nation_size_label_canary">
                SIZE: <span className="tuple_nation_size_value_jay">{selectedSize || "Select Size"}</span>
              </div>
              <div className="tuple_nation_size_buttons_crow">
                {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                  <button
                    key={size}
                    className={`tuple_nation_size_btn_kiwi ${selectedSize === size ? "tuple_nation_size_btn_active_sparrow" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="tuple_nation_size_chart_btn_wren" onClick={() => setShowSizeChart(!showSizeChart)}>
                View Size Chart {showSizeChart ? "Up" : "Down"}
              </button>
              {showSizeChart && (
                <div className="tuple_nation_size_chart_dropdown">
                  <table className="tuple_nation_size_table">
                    <thead>
                      <tr><th>Size</th><th>Waist</th><th>Length</th><th>Hip</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>S</td><td>28-30"</td><td>40"</td><td>38"</td></tr>
                      <tr><td>M</td><td>30-32"</td><td>41"</td><td>40"</td></tr>
                      <tr><td>L</td><td>32-34"</td><td>42"</td><td>42"</td></tr>
                      <tr><td>XL</td><td>34-36"</td><td>43"</td><td>44"</td></tr>
                      <tr><td>XXL</td><td>36-38"</td><td>44"</td><td>46"</td></tr>
                     <tr><td>XXXL</td><td>38-40"</td><td>45"</td><td>48"</td></tr>

                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <button className="tuple_nation_buy_now_btn_cardinal" onClick={() => handleActionClick("buy")}>
              BUY NOW
            </button>

            <div className="tuple_nation_action_buttons_tanager" style={{ marginTop: "0.75rem", position: "relative" }}>
              <button className="tuple_nation_bag_btn_oriole" onClick={() => handleActionClick("bag")}>
                <CiShoppingCart size={20} /> ADD TO BAG
              </button>

              {showSuccessToast && (
                <div className="tuple_nation_success_toast">
                  Added to bag! Size: {selectedSize}
                </div>
              )}
            </div>

            {stock < 10 && stock > 0 && (
              <p style={{ color: "#e65100", fontSize: "13px", margin: "12px 0 0", fontWeight: "500" }}>
                Only {stock} left in stock!
              </p>
            )}
          </div>
        </div>

        {/* ========== DESKTOP: ORIGINAL GRID LAYOUT ========== */}
        <section className="tuple_nation_section_three_container tuple_nation_desktop_only">
          <div className="tuple_nation_images_grid_triple_stag">
            <div className="tuple_nation_lifestyle_row">
              <img src={img1} alt="Main" className="tuple_nation_product_image_triple_antelope" />
              <img src={img2} alt="Side View" className="tuple_nation_product_image_triple_antelope" />
            </div>
          </div>

          <div className="tuple_nation_purchase_panel_lynx">
            <div className="tuple_nation_header_section_jackal">
              <h1 className="tuple_nation_product_title_meerkat">{title}</h1>
              <button onClick={shareOnWhatsApp} className="tuple_nation_share_btn_otter">
                <IoIosShareAlt size={24} color="#000000" />
              </button>
            </div>

            <div className="tuple_nation_pricing_section_puma">
              <span className="tuple_nation_price_label_camel">MRP</span>
              {previousPrice > 0 && (
                <span className="tuple_nation_price_original_flamingo">₹ {previousPrice.toLocaleString()}</span>
              )}
              <span className="tuple_nation_price_current_leopard">₹ {currentPrice.toLocaleString()}</span>
              {discount && <span className="tuple_nation_discount_badge_ostrich">{discount}% OFF</span>}
              <div className="tuple_nation_points_section_rhino">
                <span className="tuple_nation_points_icon_walrus">Gem</span>
                <span className="tuple_nation_points_text_seahorse">{Math.round(currentPrice * 0.03)} PTS</span>
              </div>
            </div>

            <div className="tuple_nation_size_section_hummingbird">
              <div className="tuple_nation_size_label_canary">
                SIZE: <span className="tuple_nation_size_value_jay">{selectedSize || "Select Size"}</span>
              </div>
              <div className="tuple_nation_size_buttons_crow">
                {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                  <button
                    key={size}
                    className={`tuple_nation_size_btn_kiwi ${selectedSize === size ? "tuple_nation_size_btn_active_sparrow" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="tuple_nation_size_chart_btn_wren" onClick={() => setShowSizeChart(!showSizeChart)}>
                View Size Chart {showSizeChart ? "Up" : "Down"}
              </button>
              {showSizeChart && (
                <div className="tuple_nation_size_chart_dropdown">
                  <table className="tuple_nation_size_table">
                    <thead>
                      <tr><th>Size</th><th>Waist</th><th>Length</th><th>Hip</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>S</td><td>28-30"</td><td>40"</td><td>38"</td></tr>
                      <tr><td>M</td><td>30-32"</td><td>41"</td><td>40"</td></tr>
                      <tr><td>L</td><td>32-34"</td><td>42"</td><td>42"</td></tr>
                      <tr><td>XL</td><td>34-36"</td><td>43"</td><td>44"</td></tr>
                      <tr><td>XXL</td><td>36-38"</td><td>44"</td><td>46"</td></tr>
                      <tr><td>XXXL</td><td>38-40"</td><td>45"</td><td>48"</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <button className="tuple_nation_buy_now_btn_cardinal" onClick={() => handleActionClick("buy")}>
              BUY NOW
            </button>

            <div className="tuple_nation_action_buttons_tanager" style={{ position: "relative" }}>
              <button className="tuple_nation_bag_btn_oriole" onClick={() => handleActionClick("bag")}>
                <CiShoppingCart size={20} /> ADD TO BAG
              </button>

              {showSuccessToast && (
                <div className="tuple_nation_success_toast">
                  Added to bag! Size: {selectedSize}
                </div>
              )}
            </div>

            {stock < 10 && stock > 0 && (
              <p style={{ color: "#e65100", fontSize: "13px", margin: "12px 0 0", fontWeight: "500" }}>
                Only {stock} left in stock!
              </p>
            )}
          </div>
        </section>

        {/* Rest of the sections (unchanged) */}
        <section className="tuple_nation_section_one_container">
          <div className="tuple_nation_images_grid_left">
            <div className="tuple_nation_side_by_side">
              <img src={img3} alt="Detail 1" className="tuple_nation_product_image_large_bear" />
              <img src={img4} alt="Detail 2" className="tuple_nation_product_image_large_bear" />
            </div>
          </div>
          <div className="tuple_nation_specs_panel_deer">
            <div className="tuple_nation_specs_grid">
              {[
                ["Style Code", product.productId ? `DRIP-${product.productId}` : `DRIP-${product.id || "XXXX"}`],
                ["Brand", "DripCo"],
                ["Category", (product.category || "UNKNOWN").replace("'S", "S")],
                ["In Stock", stock > 0 ? "Yes" : "No"],
                ["Collection", "Street Series 2025"],
              ].map(([label, value]) => (
                <div key={label} className="tuple_nation_spec_row_lion">
                  <span className="tuple_nation_spec_label_tiger">{label}:</span>
                  <span className="tuple_nation_spec_value_wolf">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tuple_nation_section_two_container">
          <div className="tuple_nation_images_grid_right_monkey" style={{ backgroundColor: "#f0f8ff", padding: "1.5rem", borderRadius: "8px" }}>
            <h3 style={{ color: "#0066cc", fontSize: "16px", fontWeight: "600", margin: "0 0 1rem 0" }}>
              PRODUCT DETAILS
            </h3>
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              {[...Array(4)].map((_, i) => <FaStar key={i} size={18} color="#FFD700" />)}
              <FaStarHalfAlt size={18} color="#FFD700" />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>4.5 (127+ reviews)</span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#444" }}>{description}</p>
          </div>

          <div className="tuple_nation_promo_section_fox">
            <div className="tuple_nation_delivery_section_owl">
              <h3 className="tuple_nation_delivery_title_raven">DELIVERY OPTIONS</h3>
              <div className="tuple_nation_delivery_feature_swan">
                <FaTruck size={22} />
                <div><div className="tuple_nation_feature_label_dragon">FREE SHIPPING*</div></div>
              </div>
              <div className="tuple_nation_delivery_feature_swan">
                <FaSync size={20} />
                <div><div className="tuple_nation_feature_label_dragon">NO RETURN/EXCHANGE FOR CUSTOM PRODUCTS</div></div>
              </div>
              <div className="tuple_nation_delivery_feature_swan">
                <FaStore size={20} />
                <div>
                  <div className="tuple_nation_feature_label_dragon">CONTACT THEDRIPCO.STORE</div>
                  <Link to="/supportdripco" className="tuple_nation_location_link_sparrow">CONTACT US</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReutrnsCode />

        {showSizeToast && (
          <div className="tuple_nation_error_toast">
            Please select a size first!
          </div>
        )}
      </div>

      {showLoginPopup && (
        <DripLoginPopup onClose={() => setShowLoginPopup(false)} onRegisterSuccess={handleRegisterSuccess} />
      )}

      {/* Mobile + General Styles */}
      <style jsx>{`
        .tuple_nation_mobile_slider {
          display: none;
          overflow: hidden;
          position: relative;
          width: 100%;
          background: #f5f1e8;
        }

        .tuple_nation_slider_inner {
          display: flex;
          transition: transform 0.4s ease-in-out;
        }

        .tuple_nation_slide {
          min-width: 100%;
        }

        .tuple_nation_mobile_image {
          width: 100%;
          height: auto;
          max-height: 80vh;
          object-fit: contain;
        }

        .tuple_nation_slider_dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 12px 0;
          background: rgba(0,0,0,0.05);
        }

        .tuple_nation_dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #999;
          cursor: pointer;
        }

        .tuple_nation_dot_active {
          background: #000;
        }

        /* Mobile Purchase Panel - Only visible on mobile */
        .tuple_nation_mobile_purchase_panel {
          display: none;
          background: white;
          border-top: 1px solid #eee;
        }

        .tuple_nation_success_toast,
        .tuple_nation_error_toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: bold;
          z-index: 9999;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          font-size: 15px;
          animation: fadeInOut 3s forwards;
        }

        .tuple_nation_success_toast {
          background: #28a745;
          color: white;
        }

        .tuple_nation_error_toast {
          background: #ff4d4f;
          color: white;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          15%, 85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 768px) {
          .tuple_nation_mobile_slider {
            display: block;
          }
          .tuple_nation_mobile_purchase_panel {
            display: block;
          }
          .tuple_nation_desktop_only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Productpagemainwrapper;