import { useState, useEffect } from "react";
import "../productgridcomponent/productlayout.css";

// MAIN THUMBNAILS (shown in grid)
import image1 from "../assets/Tshirtttttt333.jpg";
import image2 from "../assets/asasass.jpg";
import image3 from "../assets/sdsdseeee.jpg";
import image4 from "../assets/IMG_5861789.png";

// 3 EXTRA IMAGES FOR EACH T-SHIRT (you can rename these files as you like)
import t1_extra1  from "../assets/kakakakkakka.jpg";
import t1_extra2  from "../assets/lalalalallal.jpg";
import t1_extra3  from "../assets/Tshirtttttt333.jpg";

import t2_extra1  from "../assets/jzzzzz.jpg";
import t2_extra2  from "../assets/IMG_6015.png";
import t2_extra3  from "../assets/AQAQAQ.jpg";

import t3_extra1 from "../assets/jajajaaaq.jpg";
import t3_extra2 from "../assets/kkwjfghc.jpg";
import t3_extra3 from "../assets/msxewu.jpg";

import t4_extra1 from "../assets/akkakamjxfiho.jpg";
import t4_extra2 from "../assets/akkakamjxfiho.jpg";
import t4_extra3 from "../assets/awjdsfnksdjfn.jpg";    

import { useNavigate } from "react-router-dom";

const Productlayout2 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const tabs = ["TSHIRT'S"];
  const [activeTab] = useState("TSHIRT'S");

  const products = [
    {
      id: 5,
      name: "DRIPCO OVERSIZED ANIME EDITION TSHIRT - SAIYAN",
      currentPrice: "599.00",
      originalPrice: "1,299.00",
      discount: 50,
      mainImage: image1,
      gallery: [t1_extra1, t1_extra2, t1_extra3], // 3 UNIQUE extra images
      category: "TSHIRT'S",
      material: "100% Premium Cotton",
      fit: "Oversized Fit",
      color: "Black",
      description: "Unleash your inner Saiyan with this bold anime-inspired oversized tee. Perfect drop-shoulder fit, premium print that lasts forever."
    },
    {
      id: 6,
      name: "DRIPCO STREETWEAR REFLECTIVE TSHIRT - TYPHOON",
      currentPrice: "1499.00",
      originalPrice: "2999.00",
      discount: 50,
      mainImage: image2,
      gallery: [t2_extra1, t2_extra2, t2_extra3],
      category: "TSHIRT'S",
      material: "Cotton + Poly Blend",
      fit: "Oversized",
      color: "Black",
      description: "Glow in the dark reflective print. Made for night riders and street kings. Heavy GSM fabric."
    },
    {
      id: 7,
      name: "DRIPCO MINIMAL BLACK CARNATION TSHIRT",
      currentPrice: "699.00",
      originalPrice: "1499.00",
      discount: 50,
      mainImage: image3,
      gallery: [t3_extra1, t3_extra2, t3_extra3],
      category: "TSHIRT'S",
      material: "Bio-Washed Cotton",
      fit: "Relaxed Oversized",
      color: "Jet Black",
      description: "Crafted from 100% ultra-soft 240 GSM cotton, this premium oversized tee is designed for those who want their style to feel personal, intentional, and unmistakably theirs. Built with a smooth, heavyweight structure, it holds its shape while delivering everyday comfort and a luxury hand-feel.The front features a clean and minimal THE DRIP.co logo, keeping the aesthetic sharp and elevated.The back transforms the tee into a fully custom piece — upload your photo and add your name or custom text, making every shirt one-of-one. Paired with our “ONLY YOU” and “WANNA BE YOURS” typography layout, it becomes a bold blend of romance, identity, and modern street design.Whether it’s for you, your partner, or someone you want to make feel special, this tee turns memories into wearable art.Details:•	240 GSM premium full-cotton fabric•	Oversized fit for a clean streetwear silhouette•	Customizable back print: your photo + your text•	High-resolution graphic layout for a crisp, modern look•	Breathable, durable, and built for all-day comfort•	Minimal front logo for a refined finishA perfect gift, a personal statement, and a timeless piece — all in one custom tee."
    },
    {
      id: 8,
      name: "DRIPCO MUTATION GLOW EDITION TSHIRT",
      currentPrice: "699.00",
      originalPrice: "1,499.00",
      discount: 50,
      mainImage: image4,
      gallery: [t4_extra1, t4_extra2, t4_extra3],
      category: "TSHIRT'S",
      material: "Heavy Cotton 240 GSM",
      fit: "Boxy Oversized",
      color: "Black",
      description: "Mutation glow-in-dark print. Limited drop. Once gone, it’s gone forever."
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // SEND mainImage + gallery correctly to product page
  const handleProductClick = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/product/${product.id}`, { 
      state: { 
        product: {
          ...product,
          mainImage: product.mainImage,
          gallery: product.gallery || []
        }
      } 
    });
  };

  return (
    <div className={`product-grid-container ${isVisible ? "visible" : ""}`}>
      
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="product-card-wrapper"
            onClick={() => handleProductClick(product)}
            style={{ 
              transitionDelay: `${index * 0.15}s`,
              cursor: "pointer"
            }}
          >
            <div className="product-card">
              <div className="product-image-wrapper">
                {product.discount && (
                  <div className="discount-badge">
                    SAVE {product.discount}%
                  </div>
                )}
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="product-image"
                />
                <div className="quick-view-overlay">
                  <span>QUICK VIEW</span>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-prices">
                  <span className="current-price">RS. {product.currentPrice}</span>
                  <span className="original-price">RS. {product.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productlayout2;