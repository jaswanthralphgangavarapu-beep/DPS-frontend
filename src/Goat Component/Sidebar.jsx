// components/Sidebar.js
import React from 'react';
import { FaTruck, FaChevronRight, FaChevronLeft, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
 


const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="sidebar-overlay">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="back-btn" onClick={closeSidebar}>
            <FaChevronLeft />
          </div>
          <div className="sidebar-logo">
            <img src={logo} alt="The goat" />
          </div>
        </div>

        <div className="sidebar-welcome">
          <div className="user-icon">
            <FaUser />
          </div>
          <div className="welcome-text">
            <h3>WELCOME to THE DripCo.store</h3>
            <p>Go ahead and treat yourself — happy shopping!</p>
          </div>
        </div>

        

        <div className="express-delivery-banner">
          <FaTruck className="delivery-icon" />
          <div className="delivery-text">
            <h3>SHOPNOW</h3>
           
          </div>
        </div>

        {/* <div className="delivery-location">
          <p>DELIVERING TO <span className="add-location">Add delivery location</span></p>
        </div> */}

        <ul className="sidebar-menu">
          <Link to="/myaccount" style={{textDecoration:'none'}}>
          <li className="menu-item">
            <span style={{textDecoration:'none',color:'black'}}>My Account</span>
            
          </li>
          </Link>
          <li className="menu-item">
            <span>NEW ARRIVALS</span>
            
          </li>
          <Link to="/myaccount" style={{textDecoration:'none',color:'black'}}>
          <li className="menu-item">
            <span>My Orders</span>
             
          </li>
          </Link>
           <Link to="/myaccount" style={{textDecoration:'none',color:'black'}}> 
          <li className="menu-item">
            <span>Track My Order</span>
            
          </li>
          </Link>
          <Link to="/supportdripco" style={{ textDecoration: "none",color:'black' }}>
          <li className="menu-item">
            <span>Support</span>
             
          </li>
          </Link>
          
           
           
          
           
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;