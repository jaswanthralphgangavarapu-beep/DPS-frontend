import { useState } from "react"
import "../termsandaboutcomponent/aboutdesign.css"
import { Link } from "react-router-dom"

const AboutDrip = () => {
  const [activeTab, setActiveTab] = useState("mission")

  const tabs = [
    {
      id: "mission",
      label: "Our Mission",
      icon: "✦",
    },
    {
      id: "story",
      label: "Brand Story",
      icon: "◆",
    },
    {
      id: "philosophy",
      label: "Philosophy",
      icon: "★",
    },
  ]

  return (
    <div className="about-container">
      {/* Hero Section */}
       <br/>
       <br/><br/>
       <br/><br/>
       <br/>

      {/* Core Beliefs */}
      <section className="beliefs-section">
        <div className="beliefs-content">
          <h2>What We Believe</h2>
          <p className="belief-tagline">Luxury is not loud—it's precise.</p>
          <div className="beliefs-grid">
            <div className="belief-card">
              <span className="belief-icon">✤</span>
              <h3>Premium Fabric</h3>
              <p>Feel the weight of quality in every piece</p>
            </div>
            <div className="belief-card">
              <span className="belief-icon">⚡</span>
              <h3>Sharp Design</h3>
              <p>The clarity of intentional design language</p>
            </div>
            <div className="belief-card">
              <span className="belief-icon">◈</span>
              <h3>Bold Message</h3>
              <p>Every graphic carries meaning and purpose</p>
            </div>
            <div className="belief-card">
              <span className="belief-icon">◉</span>
              <h3>Confidence</h3>
              <p>Wear it with the confidence of intention</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <div className="tabs-container">
          <div className="tabs-header">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {activeTab === "mission" && (
              <div className="tab-pane active">
                <h3>To create streetwear that elevates your everyday and inspires your individuality.</h3>
                <p>
                  From oversized fits to minimal graphics and culturally inspired details, each piece is carefully
                  developed to look good, feel premium, and last long. Whether you dress for comfort, confidence, or
                  creativity—there's a place for you here.
                </p>
                <div className="highlight-box">
                  <p>
                    <strong>This is more than clothing.</strong>
                  </p>
                  <p>This is identity. Culture. Expression.</p>
                </div>
              </div>
            )}

            {activeTab === "story" && (
              <div className="tab-pane active">
                <h3>Born from a simple idea.</h3>
                <p>
                  Streetwear should feel as premium as luxury fashion, yet remain connected to culture, meaning, and
                  everyday expression. What started as a passion for design and storytelling evolved into a brand
                  committed to craftsmanship and intentionality.
                </p>
                <p>
                  Every design carries emotion—faith, patience, resilience, identity. These aren't just clothes; they're
                  messages you carry with you. From oversized silhouettes to Arabic-inspired typography, each piece
                  reflects discipline and devotion to detail.
                </p>
                <p className="story-quote">
                  <em>No shortcuts. No compromises. Just pure focus.</em>
                </p>
              </div>
            )}

            {activeTab === "philosophy" && (
              <div className="tab-pane active">
                <h3>We blend culture, expression, and meaning into every piece.</h3>
                <p>
                  We're not just a streetwear brand—we're a statement, built for people who move with purpose and style.
                  Our philosophy is rooted in the belief that fashion should be bold, clean, and meaningful.
                </p>
                <p>
                  For those who carry depth in their silence, who value meaning over noise, and who understand that
                  style is a form of expression. Every graphic, every word, every stitch is created to spark reflection,
                  to inspire, and to represent the mindset of those who stand apart.
                </p>
                <div className="philosophy-highlight">
                  <p>
                    <strong>Wear the meaning. Live the message.</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Collections Statement */}
      <section className="collections-section">
        <h2>Our Collections</h2>
        <div className="collections-grid">
          <div className="collection-item">
            <h4>Daily Essentials</h4>
            <p>Minimal, timeless pieces for everyday confidence</p>
          </div>
          <div className="collection-item">
            <h4>Statement Pieces</h4>
            <p>Bold designs carrying faith, patience & resilience</p>
          </div>
          <div className="collection-item">
            <h4>Cultural Drops</h4>
            <p>Arabic-inspired designs with profound meaning</p>
          </div>
          <div className="collection-item">
            <h4>Identity Series</h4>
            <p>Pieces that celebrate personal individuality</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Join the Movement?</h2>
          <p>Explore our latest collection and find your meaning in THE DRIP.CO</p>
          <Link to="/">
          <button className="cta-button">Browse Collection</button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutDrip;
