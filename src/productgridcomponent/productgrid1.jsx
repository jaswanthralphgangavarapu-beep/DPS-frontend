import { useState, useEffect } from "react"
import "../productgridcomponent/productlayout.css"
import image1 from "../assets/IMG_5851.png"
import image2 from "../assets/IMG_6005newwwww.jpg"
import image3 from "../assets/Wdriprrrrr.jpg"
import image4 from "../assets/IMG-20251205-WA0047.jpg"

import extra1 from "../assets/IMG_58702222222.png"    
import extra2 from "../assets/IMG_5850.png"   
import extra3 from "../assets/IMG_5853.png"    


import extra4 from "../assets/IMG_6003.jpg"
import extra5 from "../assets/dripcoimage.jpg"
import extra6 from "../assets/driocoimageeee.jpg"

import extra7 from "../assets/WEEEEEE.jpg"
import extra8 from "../assets/QWERTYTREWQ.jpg"
import extra9 from "../assets/IMG-20251205-WA0048.jpg"
import extra10 from "../assets/IMG-20251205-WA0049.jpg"
import extra11 from "../assets/IMG-20251205-WA0050.jpg"
 

import { useNavigate } from "react-router-dom"

const Productlayout = () => {
  const [activeTab, setActiveTab] = useState("PANT'S")
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const tabs = ["T-SHIRTS", "HOODIES"]

  const products = [
    {
      id: 1,
      name: "SAIYAN BLACK UNISEX STRAIGHT FIT BAGGY PANTS",
      currentPrice: "799.00",
      originalPrice: "1449.00",
      discount: 50,
      mainImage: image1,
      gallery: [extra1, extra2, extra3], 
      category: "PANT'S",
      material: "Premium Cotton",
      fit: "Baggy Fit",
      color: "Black",
      description: "Built for those who carry presence without saying a word. This 240 GSM heavyweight cotton tee combines luxury comfort with raw street attitude. The custom acid-wash finish gives each piece a unique, vintage-worn character — no two shirts ever look the same.The front features the bold SAVAGE graphic in a gothic-inspired font, setting the tone instantly. On the back, an intricate vertical artwork runs down the spine, adding depth, edge, and a high-fashion street aesthetic.Designed to be oversized with a relaxed drape, this tee feels premium while keeping the look effortless and unapologetic. Details: •	240 GSM premium full-cotton fabric•	Oversized streetwear fit•	Acid-wash finish for a unique vintage look•	Gothic “SAVAGE” chest print•	Detailed back artwork for a statement silhouette•	Soft, durable, and made for everyday wear A tee made for the fearless — for those who define their own lane."
    },
    {
      id: 2,
      name: "TYPHOON BLACK UNISEX STRAIGHT FIT BAGGY PANTS",
      currentPrice: "1499.00",
      originalPrice: "2999.00",
      discount: 50,
      mainImage: image2,
      gallery: [extra4, extra5, extra6],  
      category: "PANT'S",
      material: "Cotton Blend",
      fit: "Straight Fit",
      color: "Black",
      description: "A hoodie built for memories that matter. Crafted from 430 GSM ultra-heavy premium cotton, this piece delivers unmatched structure, warmth, and durability — the kind of quality that feels luxury the moment you put it on.The back features a fully customizable collage layout: add your photos, your date, your initials, your message — everything that makes this hoodie one-of-one. Paired with the bold ONLY YOU typography, it becomes a statement of love, identity, and loyalty, designed to be worn proudly.Whether it’s for your partner, your best friend, an anniversary, or a moment you never want to forget, this hoodie turns your story into wearable art.Details:•	430 GSM ultra-heavy cotton for premium structure•	Oversized fit with dropped shoulders•	Customizable back: photos, text, initials, dates, symbols•	High-precision, long-lasting print•	Soft brushed interior for comfort•	Clean streetwear look with gallery-style layoutA piece made to last — because the memories printed on it should too."
    },
    {
      id: 3,
      name: "CARNATION BLACK UNISEX STRAIGHT FIT BAGGY PANTS",
      currentPrice: "699.00",
      originalPrice: "1,319.00",
      discount: 50,
      mainImage: image3,
      gallery: [extra7, extra8, image3],
      category: "PANT'S",
      material: "Heavy Cotton",
      fit: "Relaxed Fit",
      color: "Black",
      description: "Built for the ones who carry edge in their energy. This 240 GSM heavyweight cotton tee merges premium comfort with a bold, metal-inspired aesthetic. The custom acid-wash treatment gives every piece a raw, textured look — making each shirt uniquely its own.The front features the iconic THE DRIP.co logo redesigned in a sharp, metalcore-inspired style, giving it a fierce and standout presence. On the back, an aggressive graffiti-metal graphic stretches across the shoulders, adding attitude and a high-fashion underground vibe.Designed with an oversized silhouette, this tee drapes clean while maintaining structure — perfect for styling with cargos, denim, or layered streetwear fits.Details:•	240 GSM premium heavyweight cotton•	Oversized streetwear fit•	Unique acid-wash vintage texture•	Front metal-style THE DRIP.co logo•	Back full-width graffiti-metal graphic•	Soft, durable, and made for everyday wearA gritty, statement piece made for those who aren’t afraid to stand out."
    },
    {
      id: 4,
      name: "MUTATION UNISEX STRAIGHT FIT BAGGY PANTS",
      currentPrice: "1499.00",
      originalPrice: "2999.00",
      discount: 50,
      mainImage: image4,
      gallery: [extra9, extra10, extra11],
      category: "PANT'S",
      material: "Poly-Cotton Blend",
      fit: "Baggy",
      color: "Black",
      description: "Engineered for those who move with intention, this 430 GSM heavyweight hoodie is built to feel as bold as it looks. Crafted from ultra-dense, luxury-grade cotton, it delivers unmatched structure, warmth, and durability — the kind of quality you feel the moment you put it on.The front features our signature THE DRIP.co branding in a refined, elevated type, paired with a subtle illustrated accent for a premium streetwear edge. Each sleeve is marked with the powerful dual-motif “sin” and “punishment”, adding depth, meaning, and attitude without overpowering the minimal silhouette.The oversized fit is designed for comfort and presence — dropped shoulders, clean drape, and a shape that never collapses. On the back, the hoodie stays intentionally blank, letting the garment’s build and form speak for itself.Details:•	430 GSM ultra-heavy premium cotton•	Oversized silhouette with dropped shoulders•	Front kangaroo pocket•	High-precision prints: sin / punishment sleeve detailing•	Signature THE DRIP.co chest branding•	Smooth interior for maximum comfort, structured exterior for a luxury feelA statement piece made for cold nights, city streets, and anyone who demands artistry in every stitch."
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredProducts = products.filter(p => p.category === activeTab)

  const handleProductClick = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    navigate(`/product/${product.id}`, { 
      state: { 
        product: {
          ...product,
          mainImage: product.mainImage,
          gallery: product.gallery || []
        }
      } 
    })
  }

  return (
    <div className={`product-grid-container ${isVisible ? "visible" : ""}`}>
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="product-card-wrapper"
            onClick={() => handleProductClick(product)}
            style={{ transitionDelay: `${index * 0.15}s`, cursor: "pointer" }}
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
  )
}

export default Productlayout;