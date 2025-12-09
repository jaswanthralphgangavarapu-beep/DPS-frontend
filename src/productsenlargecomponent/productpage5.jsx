// src/components/ProductPage5.jsx
import { useState } from "react";
import "../productsenlargecomponent/productspagedesign.css";
import image1 from "../assets/product5.png";
import { CiShoppingCart } from "react-icons/ci";
import { FaTruck, FaSync, FaStore } from "react-icons/fa";
import DripLoginPopup from "../usercredentialscomponent/loginpopup";
import ReutrnsCode from '../returnscomponent/returnscode';
import { IoIosShareAlt } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Global Cart

const ProductPage5 = () => {
  const [selectedSize, setSelectedSize] = useState("XL");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBagPopup, setShowBagPopup] = useState(false);
  const [showSizeToast, setShowSizeToast] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [bagItems, setBagItems] = useState([]); // Optional: sync with cart context

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent("https://dripco.store");
    const text = encodeURIComponent("Check out this awesome T-Shirt on DripCo!");
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  // Add to global cart + show toast if no size
  const handleGoToBag = () => {
    if (!selectedSize) {
      setShowSizeToast(true);
      setTimeout(() => setShowSizeToast(false), 3000);
      return;
    }

    addToCart({
      id: "product-5",
      name: "Men Black Textured Crew Neck T-Shirt",
      price: 1779,
      size: selectedSize,
      image: image1,
      quantity: 1
    });

    alert(`Added to bag! Size: ${selectedSize}`);
  };

  const handleProceedToCheckout = () => {
    setShowBagPopup(false);
    setShowMobilePopup(true);
  };

  const handleMobileSubmit = () => {
    if (mobileNumber.length === 10 && /^\d+$/.test(mobileNumber)) {
      localStorage.setItem("dripco_user_mobile", mobileNumber);
      localStorage.setItem("dripco_bag", JSON.stringify(bagItems));
      navigate("/checkout");
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  return (
    <>
      <div className="tuple_nation_product_wrapper">

        {/* ========== HERO + PURCHASE ========== */}
        <section className="tuple_nation_section_three_container">
          <div className="tuple_nation_images_grid_triple_stag">
            <div className="tuple_nation_lifestyle_row">
              <img src={image1} alt="Lifestyle 1" className="tuple_nation_product_image_triple_antelope" />
              <img src={image1} alt="Lifestyle 2" className="tuple_nation_product_image_triple_antelope" />
            </div>
          </div>

          <div className="tuple_nation_purchase_panel_lynx">
            <div className="tuple_nation_header_section_jackal">
              <h1 className="tuple_nation_product_title_meerkat">
                Men Black Textured Crew Neck T-Shirt
              </h1>
              <button onClick={shareOnWhatsApp} className="tuple_nation_share_btn_otter">
                <IoIosShareAlt size={24} color="#000000" />
              </button>
            </div>

            <div className="tuple_nation_pricing_section_puma">
              <span className="tuple_nation_price_label_camel">MRP</span>
              <span className="tuple_nation_price_original_flamingo">₹ 1,999.00</span>
              <span className="tuple_nation_price_current_leopard">₹ 1,779.00</span>
              <span className="tuple_nation_discount_badge_ostrich">11% OFF</span>
              <div className="tuple_nation_points_section_rhino">
                <span className="tuple_nation_points_icon_walrus">Gem</span>
                <span className="tuple_nation_points_text_seahorse">53 PTS</span>
              </div>
            </div>

            <div className="tuple_nation_size_section_hummingbird">
              <div className="tuple_nation_size_label_canary">
                SIZE: <span className="tuple_nation_size_value_jay">{selectedSize}</span>
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
              <button
                className="tuple_nation_size_chart_btn_wren"
                onClick={() => setShowSizeChart(!showSizeChart)}
              >
                View Size Chart {showSizeChart ? "Up" : "Down"}
              </button>

              {showSizeChart && (
                <div className="tuple_nation_size_chart_dropdown">
                  <table className="tuple_nation_size_table">
                    <thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th></tr></thead>
                    <tbody>
                      <tr><td>S</td><td>38"</td><td>26"</td><td>16.5"</td></tr>
                      <tr><td>M</td><td>40"</td><td>27"</td><td>17"</td></tr>
                      <tr><td>L</td><td>42"</td><td>28"</td><td>17.5"</td></tr>
                      <tr><td>XL</td><td>44"</td><td>29"</td><td>18"</td></tr>
                      <tr><td>XXL</td><td>46"</td><td>30"</td><td>18.5"</td></tr>
                      <tr><td>XXXL</td><td>48"</td><td>31"</td><td>19"</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <button
              className="tuple_nation_buy_now_btn_cardinal"
              onClick={() => setShowLoginPopup(true)}
            >
              BUY NOW
            </button>

            <div className="tuple_nation_action_buttons_tanager">
              <button className="tuple_nation_bag_btn_oriole" onClick={handleGoToBag}>
                <CiShoppingCart size={20} /> GO TO BAG
              </button>
            </div>
          </div>
        </section>

        {/* ========== DETAILED VIEWS ========== */}
        <section className="tuple_nation_section_one_container">
          <div className="tuple_nation_images_grid_left">
            <div className="tuple_nation_side_by_side">
              <img src={image1} alt="Front" className="tuple_nation_product_image_large_bear" />
              <img src={image1} alt="Side" className="tuple_nation_product_image_large_bear" />
            </div>
          </div>

          <div className="tuple_nation_specs_panel_deer">
            <div className="tuple_nation_specs_grid">
              {[
                ["Material", "50% Cotton, 46% Modal and 4% Spandex"],
                ["Fit", "Oversized Fit"],
                ["Style Code", "ALKCADSF886679"],
                ["Brand", "Allen Solly"],
                ["Color", "Black"],
                ["Neck", "Crew Neck"],
                ["Occasion", "Casual"],
                ["Pattern", "Textured"],
                ["Sleeves", "Half Sleeves"],
                ["Subbrand", "Allen Solly Jeans"],
                ["Product Type", "T-Shirt"],
                ["Collection", "AL Authentic"],
              ].map(([label, value]) => (
                <div key={label} className="tuple_nation_spec_row_lion">
                  <span className="tuple_nation_spec_label_tiger">{label}:</span>
                  <span className="tuple_nation_spec_value_wolf">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== BACK VIEWS + DELIVERY ========== */}
        <section className="tuple_nation_section_two_container">
          <div className="tuple_nation_images_grid_right_monkey">
            <div className="tuple_nation_side_by_side">
              <img src={image1} alt="Back" className="tuple_nation_product_image_medium_giraffe" />
              <img src={image1} alt="Detail" className="tuple_nation_product_image_medium_giraffe" />
            </div>
          </div>

          <div className="tuple_nation_promo_section_fox">
            <div className="tuple_nation_delivery_section_owl">
              <h3 className="tuple_nation_delivery_title_raven">DELIVERY OPTIONS</h3>

              <div className="tuple_nation_delivery_feature_swan">
                <FaTruck size={22} color="#0066cc" />
                <div>
                  <div className="tuple_nation_feature_label_dragon">FREE SHIPPING*</div>
                  <div className="tuple_nation_feature_desc_unicorn">Easy exchange available</div>
                </div>
              </div>

              <div className="tuple_nation_delivery_feature_swan">
                <FaSync size={20} color="#0066cc" />
                <div>
                  <div className="tuple_nation_feature_label_dragon">15 DAYS FREE RETURN & EXCHANGE*</div>
                </div>
              </div>

              <div className="tuple_nation_delivery_feature_swan">
                <FaStore size={20} color="#0066cc" />
                <div>
                  <div className="tuple_nation_feature_label_dragon">Grab Size XL from nearby store</div>
                  <a href="#location" className="tuple_nation_location_link_sparrow">Select location</a>
                </div>
              </div>
            </div>

            <div className="tuple_nation_product_desc_section_butterfly">
              <h3 className="tuple_nation_desc_title_honeybee">PRODUCT DESCRIPTION</h3>
              <p className="tuple_nation_desc_text_ladybug">
                Crafted from a blend of cotton, modal, and spandex, this Allen Solly black t-shirt offers unrivalled comfort...
              </p>
            </div>
          </div>
        </section>

        <ReutrnsCode />
      </div>

      {/* ========== LOGIN POPUP ========== */}
      {showLoginPopup && <DripLoginPopup onClose={() => setShowLoginPopup(false)} />}

      {/* ========== SIZE TOAST ========== */}
      {showSizeToast && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          background: '#ff4d4f', color: 'white', padding: '14px 28px', borderRadius: '50px',
          fontWeight: 'bold', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          Please select a size first!
        </div>
      )}

      {/* ========== BAG POPUP ========== */}
      {showBagPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9998 }}
          onClick={() => setShowBagPopup(false)}>
          <div style={{ background: 'white', width: '90%', maxWidth: '480px', borderRadius: '16px', padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Your Bag ({bagItems.reduce((s, i) => s + i.qty, 0)})</h2>
              <button onClick={() => setShowBagPopup(false)} style={{ fontSize: '28px', background: 'none', border: 'none' }}>×</button>
            </div>

            {bagItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>Your bag is empty</p>
            ) : (
              bagItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '16px 0', borderBottom: '1px solid #eee' }}>
                  <img src={item.image} alt="product" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '14px' }}>{item.name}</p>
                    <p style={{ margin: 0, color: '#666' }}>Size: <strong>{item.size}</strong></p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <button style={{ width: '32px', height: '32px', border: '1px solid #ddd', background: '#fff' }}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                      <button style={{ width: '32px', height: '32px', border: '1px solid #ddd', background: '#fff' }}>+</button>
                      <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                  <button style={{ color: '#ff4d4f', background: 'none', border: 'none' }}>Remove</button>
                </div>
              ))
            )}

            <button style={{
              width: '100%', background: '#000', color: 'white', padding: '16px',
              border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', marginTop: '20px'
            }} onClick={handleProceedToCheckout}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}

      {/* ========== MOBILE NUMBER POPUP ========== */}
      {showMobilePopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '400px', borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px' }}>Enter Mobile Number</h2>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit number"
              style={{
                width: '100%', padding: '14px', fontSize: '16px', border: '2px solid #ddd',
                borderRadius: '8px', textAlign: 'center', letterSpacing: '2px'
              }}
              maxLength="10"
              autoFocus
            />
            <p style={{ margin: '10px 0', color: '#666', fontSize: '12px' }}>
              {mobileNumber.length}/10 digits
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowMobilePopup(false); setMobileNumber(""); }}
                style={{ flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px' }}>
                Cancel
              </button>
              <button
                onClick={handleMobileSubmit}
                style={{
                  flex: 1, padding: '12px', background: mobileNumber.length === 10 ? '#000' : '#ccc',
                  color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold'
                }}
                disabled={mobileNumber.length !== 10}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage5;