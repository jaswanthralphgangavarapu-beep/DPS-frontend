import React from 'react';
import '../returnscomponent/returndesign.css';
import { FaMobile } from "react-icons/fa";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";

const ReutrnsCode = () => {
  return (
    <section className="dripcoreturn-section">
      <div className="dripcoreturn-container">
        <div className="dripcoreturn-item">
          <div className="dripcoreturn-icon dripcoreturn-truck">
            <TbTruckDelivery/>
          </div>
          <h3 className="dripcoreturn-title">FREE DELIVERY ANYWHERE IN INDIA</h3>
          <p className="dripcoreturn-desc">Dispatched in 48 hours,<br />delivered in just 3 working days*</p>
        </div>
        <div className="dripcoreturn-item">
          <div className="dripcoreturn-icon dripcoreturn-exchange">↻</div>
          <h3 className="dripcoreturn-title">EASY EXCHANGES</h3>
          <p className="dripcoreturn-desc">72-hour window for quick size or product<br /></p>
        </div>
        <div className="dripcoreturn-item">
          <div className="dripcoreturn-icon dripcoreturn-support">
            <FaMobile/>
          </div>
          <h3 className="dripcoreturn-title">CUSTOMER SUPPORT</h3>
          <p className="dripcoreturn-desc">Reach us anytime: theedrip.co@gmail.com<br />WhatsApp +918125505568</p>
        </div>
        <div className="dripcoreturn-item">
          <div className="dripcoreturn-icon dripcoreturn-happy">
            <BiSolidHappyHeartEyes/>
          </div>
          <h3 className="dripcoreturn-title">100+ HAPPY CUSTOMERS</h3>
          <p className="dripcoreturn-desc">More than numbers - a family of happy<br />customers.</p>
        </div>
      </div>
    </section>
  );
};

export default ReutrnsCode;