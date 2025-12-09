import React from 'react';
import "../Goat Css/Footer.css"
import phonepe from "../assets/phonepe.png"
import gpay from "../assets/gpay.png"
import paytm from "../assets/paytm.png"
import internet from "../assets/internet.png"
import qrcode from "../assets/instgreamqrcode.jpg"
import { Link } from 'react-router-dom';
const Footer = ()=> {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-column customer-care">
            <h3>CUSTOMER CARE</h3>
            <ul>
            <Link to="/myaccount" style={{textDecoration:'none'}}> 
              <li><a href="#">Track an Order</a></li>
              </Link>
              <Link to="/myaccount" style={{textDecoration:'none'}}> 
              <li><a href="#">Orders</a></li>
              </Link>
              <Link to="/supportdripco" style={{textDecoration:'none'}}> 
              <li><a href="#">Contact Us</a></li>
              </Link>
              <Link to="/myaccount" style={{textDecoration:'none'}}> 
              <li><a href="#">Delivery</a></li>
              </Link>
              
              <li><a href="#">Payment</a></li>
               
            </ul>
          </div>
          <div className="footer-column about-us">
            <h3>ABOUT US</h3>
            <ul>
              <li><Link to="/aboutdripcostore">About THE DRIPCO</Link></li>
              <li><a href="#">People & Planet</a></li>
              <li><Link to="/terms&conditionsdripco">Terms & Conditions</Link></li>
              <li><Link to="/terms&conditionsdripco">Policy</Link></li>
             
            </ul>
          </div>
          <div className="footer-app-section">
            <h3>VISIT US ON INSTGRAM</h3>
            <p>Scan the QR code with your iOS or Android smartphone</p>
            <div className="qr-code-placeholder">
            
              <div className="qr-placeholder">
                 <img src={qrcode} alt="insta" style={{width:'100px',height:'100px'}}/>
              </div>
            </div>
            
          </div>
          <div className="footer-payments">
            <h3>THE DRIPCO ACCEPTS</h3>
            <div className="payment-icons">
              {/* Icons for PhonePe, GPay, Paytm, Debit Card */}
              <img src={phonepe} alt="PhonePe" />
              <img src={gpay} alt="GPay" />
              <img src={paytm} alt="Paytm" />
              <img src={internet} alt="Debit Card" />
            </div>
            
             
          </div>
        </div>
        <div className="footer-bottom">
          <div className="mr-porter-section">
            <h3>THE DRIPCO</h3>
            <p>Shop from over better brands & Customised T-shirts be dressed for any event</p>
            <a href="https://thedripco.store">VISIT THEDRIPCO.COM</a>
          </div>
          <div className="copyright-chat">
            <p className="copyright">© 2025 THE DRIPCO</p>
            <a href="https://wa.me/918125505568?text=hey%20i%20want%20to%20know%20more%20this%20brand%20!!" target="_blank" rel="noopener noreferrer" className="chat-button">Chat to an expert</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;