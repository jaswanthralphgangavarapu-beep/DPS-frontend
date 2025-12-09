import { useState, useEffect } from "react";
import "../productgridcomponent/productlayout.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_BASE = "http://195.35.45.56:4646";

const ProductlayoutMain = () => {
  const [activeTab, setActiveTab] = useState("PANT'S");
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const tabs = ["TSHIRTS", "HOODIES"];

  // FETCH PRODUCTS FROM REAL BACKEND
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/all`);
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products from server:", err);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000); // Auto refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(p => p.category === activeTab);
  const total = filteredProducts.length;
  const hasMore = total > 8;

  const displayedProducts = showProducts
    ? (expanded ? filteredProducts : filteredProducts.slice(0, 8))
    : [];

  const getDiscount = (current, previous) => {
    if (!previous) return null;
    const c = parseFloat(current);
    const p = parseFloat(previous);
    if (isNaN(c) || isNaN(p) || p <= 0) return null;
    return Math.round(((p - c) / p) * 100);
  };

  const goToCategory = () => {
    navigate(`/category/${activeTab.toLowerCase().replace("'s", "s")}`);
  };

  const toggleShow = () => {
    if (!showProducts) {
      setShowProducts(true);
      setExpanded(false);
    } else {
      setExpanded(prev => !prev);
    }
  };

  const hideAll = () => {
    setShowProducts(false);
    setExpanded(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowProducts(false);
    setExpanded(false);
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      cartId: Date.now() + Math.random(),
      id: product.id,
      name: product.title,
      price: parseFloat(product.price),
      quantity: 1,
      image: `${API_BASE}${product.imageUrl}` || "https://via.placeholder.com/70",
    };
    addToCart(cartItem);
    alert(`${product.title} added to cart!`);
  };

  const openProductPage = (product) => {
    navigate(`/product/${product.productId}`, { state: { product } });
  };

  return (
    <div className={`product-grid-container ${isVisible ? "visible" : ""}`}>
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => switchTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ minHeight: "400px" }}>
        {/* SHOW "VIEW ALL PRODUCTS" BUTTON ONLY IF PRODUCTS EXIST */}
        {!showProducts && total > 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <button onClick={toggleShow} className="big-btn">
              VIEW ALL PRODUCTS
            </button>
          </div>
        )}

        {/* SHOW PRODUCTS GRID */}
        {showProducts && displayedProducts.length > 0 && (
          <>
            <div className="products-grid">
              {displayedProducts.map((product, index) => {
                const discount = getDiscount(product.price, product.previousPrice);
                return (
                  <div
                    key={product.id}
                    className="product-card-wrapper"
                    style={{
                      transitionDelay: `${index * 0.15}s`,
                      animation: "fadeInUp 0.6s ease forwards"
                    }}
                  >
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        {discount !== null && (
                          <div className="discount-badge">SAVE {discount}%</div>
                        )}
                        <img
                          src={`${API_BASE}${product.imageUrl}`}
                          alt={product.title}
                          className="product-image"
                          onClick={() => openProductPage(product)}
                          style={{ cursor: "pointer" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.title}</h3>
                        <div className="product-prices">
                          <span className="current-price">₹{product.price}</span>
                          {product.previousPrice && (
                            <span className="original-price">₹{product.previousPrice}</span>
                          )}
                        </div>
                        {product.stock <= 0 ? (
                          <p style={{ color: "red", marginTop: "8px", fontWeight: "bold" }}>
                            Out of Stock
                          </p>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            style={{
                              marginTop: "12px",
                              width: "100%",
                              padding: "12px",
                              background: "#000",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              cursor: "pointer",
                              fontSize: "14px"
                            }}
                          >
                            ADD TO CART
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIEW MORE / VIEW LESS + VIEW ALL IN SHOP */}
            <div style={{
              textAlign: "center",
              marginTop: "50px",
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button 
                onClick={expanded ? hideAll : toggleShow} 
                className={expanded ? "btn-outline" : "btn-black"}
              >
                {expanded ? "VIEW LESS" : "VIEW MORE"}
              </button>

              {hasMore && (
                <button onClick={goToCategory} className="btn-black">
                  VIEW ALL IN SHOP
                </button>
              )}
            </div>
          </>
        )}

        {/* NO PRODUCTS MESSAGE */}
        {total === 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <p>No {activeTab.toLowerCase()} available right now.</p>
          </div>
        )}
      </div>

      {/* SAME STYLING AS BEFORE */}
      <style jsx>{`
        .big-btn {
          padding: 18px 60px;
          font-size: 1.4rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          transition: all 0.3s;
        }
        .big-btn:hover {
          background: #333;
          transform: translateY(-3px);
        }
        .btn-black {
          padding: 14px 36px;
          font-size: 1rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-outline {
          padding: 14px 36px;
          font-size: 1rem;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProductlayoutMain;