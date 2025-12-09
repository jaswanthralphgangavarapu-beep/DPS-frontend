"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { IoIosShareAlt } from "react-icons/io";
import "../Pages/NewArrivals.css"; // Make sure this file exists

const products = [
  {
    id: 1,
    title: "Men Olive Slim Fit Solid Full Sleeves Casual Shirt",
    price: 1799,
    oldPrice: 4999,
    tag: "Casual Shirts",
    color: "Olive",
    image: "https://tse2.mm.bing.net/th/id/OIP.Lf9cZmsmrQFlioq2Ns9iDwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 2,
    title: "Women White Casual Tote Bag",
    price: 2599,
    oldPrice: 4999,
    tag: "Totes",
    color: "White",
    image: "https://tse1.explicit.bing.net/th/id/OIP.N0Vt4naakUttMUx8hv7L-gHaHa?pid=ImgDet&w=203&h=203&c=7&o=7&rm=3",
  },
  {
    id: 3,
    title: "Men White Slim Fit Solid Full Sleeves Casual Shirt",
    price: 2499,
    oldPrice: 4799,
    tag: "Casual Shirts",
    color: "White",
    image: "https://tse3.mm.bing.net/th/id/OIP.n3C6vRulv3WENyCBrQhKGgHaHa?pid=ImgDet&w=203&h=203&c=7&o=7&rm=3",
  },
  {
    id: 4,
    title: "Men Olive Slim Fit Solid Full Sleeves Casual Shirt",
    price: 2491,
    oldPrice: 2799,
    tag: "Casual Shirts",
    color: "Olive",
    image: "https://tse3.mm.bing.net/th/id/OIP.oa1vzveJ0Rc-L70iAY4zQAHaHa?pid=ImgDet&w=203&h=203&c=7&o=7&rm=3",
  },
  {
    id: 5,
    title: "Men Navy Solid Full Sleeves Jacket",
    price: 3691,
    oldPrice: 6299,
    tag: "Jackets",
    color: "Navy",
    image: "https://cdn.pixabay.com/photo/2024/04/29/04/21/tshirt-8726721_1280.jpg",
  },
];

const NewArrivals = () => {
  const { addToCart } = useCart();

  const calculateDiscount = (oldPrice, price) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const cartItem = {
      cartId: Date.now() + Math.random(),
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      color: product.color || "Default",
      size: "M",
      quantity: 1,
    };

    addToCart(cartItem);
    alert("Added to bag!");
  };

  const shareProduct = (e, product) => {
    e.stopPropagation();
    const url = window.location.href;
    const text = `Check out this out: ${product.title} - DripCo`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank");
  };

  return (
    <div className="New-arrival-foodname" style={{ paddingTop: "90px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            color: "#000",
            letterSpacing: "-0.5px",
          }}
        >
          Trending Styles
        </h1>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            fontSize: "16px",
            fontWeight: "500",
            color: "#444",
          }}
        >
          <span style={{ color: "#000", borderBottom: "3px solid #000", paddingBottom: "10px" }}>
            ALL
          </span>
          <span style={{ cursor: "pointer" }}>MEN</span>
          <span style={{ cursor: "pointer" }}>WOMEN</span>
          <span style={{ cursor: "pointer" }}>BOYS</span>
          <span style={{ cursor: "pointer" }}>GIRLS</span>
        </div>
      </div>

      {/* Products Grid → Now Horizontal Scroll */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "1.5rem",
          padding: "20px 2rem",
          scrollbarWidth: "thin",
        }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              transition: "all 0.4s ease",
              flex: "0 0 320px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "cover",
                  transition: "transform 0.6s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />

              {/* Share Button */}
              <button
                onClick={(e) => shareProduct(e, item)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <IoIosShareAlt size={22} color="#000" />
              </button>
            </div>

            {/* Product Info */}
            <div style={{ padding: "1.4rem" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#0066cc",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.tag}
              </p>

              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  margin: "0 0 10px 0",
                  lineHeight: "1.3",
                  color: "#1a1a1a",
                  height: "48px",
                  overflow: "hidden",
                }}
              >
                {item.title.length > 60 ? item.title.substring(0, 60) + "..." : item.title}
              </h3>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#999", textDecoration: "line-through" }}>
                  ₹{item.oldPrice.toLocaleString()}
                </span>
                <span style={{ fontSize: "24px", fontWeight: "700", color: "#000" }}>
                  ₹{item.price.toLocaleString()}
                </span>
                <span
                  style={{
                    background: "#ff0000",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {calculateDiscount(item.oldPrice, item.price)}% OFF
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "#555", margin: "8px 0" }}>
                Color: <strong>{item.color}</strong>
              </p>

              {/* Add to Bag Button */}
              <button
                onClick={(e) => handleAddToCart(e, item)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "12px",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#000")}
              >
                Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;