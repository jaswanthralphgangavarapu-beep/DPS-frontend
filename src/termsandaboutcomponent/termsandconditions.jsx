import { useState } from "react"
import "../termsandaboutcomponent/termsdesign.css"

const TermsAndCondition = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const sections = [
    {
      id: 1,
      title: "GENERAL INFORMATION",
      content:
        "This website provides online retail services for streetwear apparel and accessories. By purchasing from our website, you agree to comply with all policies stated here and any additional terms linked on our site. We reserve the right to update, change, or replace any part of these Terms & Conditions at any time.",
    },
    {
      id: 2,
      title: "ELIGIBILITY",
      content:
        "By using this site, you confirm that you are at least 18 years old, OR you have permission from a legal guardian. You are legally able to enter into binding contracts.",
    },
    {
      id: 3,
      title: "PRODUCT INFORMATION",
      content:
        "We strive to display product colors, graphics, and details as accurately as possible. However, we cannot guarantee that your device's screen displays colors perfectly. All products are subject to availability, possible limited quantities, and potential changes in pricing or descriptions. We reserve the right to discontinue any product at any time.",
    },
    {
      id: 4,
      title: "ORDERING & PAYMENT",
      content:
        "By placing an order, you agree that all billing information provided is accurate and complete. You are authorized to use the payment method selected. We may refuse or cancel orders if fraud or unauthorized activity is suspected. Accepted payment methods include UPI, Credit/Debit Cards, Net Banking, and Wallets.",
    },
    {
      id: 5,
      title: "SHIPPING & DELIVERY",
      content:
        "Shipping times may vary based on location, courier availability, and order volume. We are not responsible for delays caused by courier companies, incorrect shipping information provided by customers, or customs charges for international orders.",
    },
    {
      id: 6,
      title: "RETURNS & EXCHANGES",
      content:
        "Products must be unused, unworn, and in original packaging. Customized or limited-edition items may not be eligible for returns. We reserve the right to refuse returns that do not meet our conditions.",
    },
    {
      id: 7,
      title: "CANCELLATIONS",
      content:
        "We may cancel an order if the product becomes unavailable, payment issues occur, or fraudulent activity is suspected. Customers may request cancellation before the order is processed. Once shipped, it cannot be cancelled.",
    },
    {
      id: 8,
      title: "INTELLECTUAL PROPERTY",
      content:
        "All content on this website—including logos, product designs, images, graphics, text, and website layout—is the property of THE DRIP.CO and protected under copyright laws. You may not copy, reproduce, or resell any content without permission.",
    },
    {
      id: 9,
      title: "PROHIBITED USES",
      content:
        "You agree NOT to use our site for illegal activities, attempting to hack or disrupt site functionality, copying designs or intellectual property, or harassing other users. Violation of these rules may result in legal action.",
    },
    {
      id: 10,
      title: "LIMITATION OF LIABILITY",
      content:
        "We are not liable for damages from using or not being able to use the website, losses due to delayed or failed delivery, or issues caused by third-party services. Your use of the site is at your own risk.",
    },
    {
      id: 11,
      title: "PRIVACY POLICY",
      content:
        "Your personal data is handled according to our Privacy Policy, which forms part of these Terms & Conditions.",
    },
    {
      id: 12,
      title: "GOVERNING LAW",
      content:
        "These Terms & Conditions are governed by the laws applicable to our jurisdiction. Any disputes will be handled in appropriate courts of law.",
    },
  ]

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="terms-container">
    <br/><br/><br/>
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Last Updated: December 6, 2025</p>
        <div className="divider"></div>
      </div>

      <div className="terms-intro">
        <p>
          Welcome to <span className="brand">THE DRIP.CO</span>. By accessing or using our website, you agree to the
          following Terms & Conditions. Please read them carefully.
        </p>
      </div>

      <div className="terms-sections">
        {sections.map((section) => (
          <div key={section.id} className="section-item">
            <div className="section-header" onClick={() => toggleSection(section.id)}>
              <div className="section-title-wrapper">
                <span className="section-number">{String(section.id).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              <button className={`expand-btn ${expandedSection === section.id ? "active" : ""}`}>+</button>
            </div>
            {expandedSection === section.id && (
              <div className="section-content">
                <p>{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="terms-footer">
        <div className="contact-section">
          <h3>Questions?</h3>
          <p>Contact us for any clarifications regarding our Terms & Conditions</p>
          <div className="contact-info">
            <a href="mailto:thedrip.co@gmail.com">thedrip.co@gmail.com</a>
            <span>•</span>
            <a href="tel:+918125505568">+91 8125505568</a>
          </div>
        </div>
        <p className="copyright">
          © 2025 THE DRIP.CO. All rights reserved. Intentional clothing for intentional people.
        </p>
      </div>
    </div>
  )
}

export default TermsAndCondition;
