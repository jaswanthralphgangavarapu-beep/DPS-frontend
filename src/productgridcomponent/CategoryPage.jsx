// src/pages/CategoryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../productgridcomponent/productlayout.css";

const CategoryPage = () => {
  const { category } = useParams(); // e.g., "pants" or "tshirts"
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const formatCategory = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1) + "'S";
  };

  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem("admin-products");
      if (saved) {
        const all = JSON.parse(saved);
        const formatted = formatCategory(category); // "pants" → "PANT'S"
        setProducts(all.filter(p => p.category === formatted));
      }
    };
    loadProducts();
    const interval = setInterval(loadProducts, 1000);
    return () => clearInterval(interval);
  }, [category]);

  const getDiscount = (current, previous) => {
    /* same as above */
  };

  return (
    <div className="product-grid-container visible" style={{ padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.5rem" }}>
        All {formatCategory(category)}
      </h1>
      <div className="products-grid">
        {/* Same product card mapping as above, but show ALL products */}
        {products.map((product, index) => { /* ... same card code ... */ })}
      </div>
    </div>
  );
};

export default CategoryPage;