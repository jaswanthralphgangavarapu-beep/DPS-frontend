import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

import Navbar from "./Goat Component/Navbar";
import MainContent from "./Goat Component/MainComponent";
import Sidebar from "./Goat Component/Sidebar";
import Footer from "./Goat Component/Footer";

import Productlayout from "./productgridcomponent/productgrid1";
import Productlayout2 from "./productgridcomponent/productgrid2";
import Productlayout3 from "./productgridcomponent/productgrid3";
import ReutrnsCode from "./returnscomponent/returnscode";
import Designated from "./designatedcomponent/designatedcode";
 
import ProductCart from "./productaddedcartcomponent/productcart";
import { CartProvider } from "./context/CartContext";
 
import ScrollToTop from "./scrolltoptopcomponent/scrolltootop";
 
 
import AdminPanel from "./adminpanelcomponent/adminpanelcode";
import ProductlayoutMain from "./productgridcomponent/productlayoutmain";
import CategoryPage from "./productgridcomponent/CategoryPage";
import NewArrivals from "../src/Pages/NewArrivals";
import SupportPage from "./supportcomponent/supportpage.jsx";
// ADD THIS IMPORT
import Productpagemainwrapper from "../src/productsenlargecomponent/productpagemainwrapper.jsx";   
import MyOrders from "./myorderscomponent/myorderspage.jsx";
import UserDetail from "./adminpanelcomponent/userdetails.jsx";
import UserAddresses from "./adminpanelcomponent/useraddresscomponent.jsx";
import UserOrders from "./adminpanelcomponent/userorders.jsx";
import ProductIdAdminData from "./adminpanelcomponent/productdetailsadmin.jsx";

import AdminUserRelationshipWrapper from "./adminpanelcomponent/adminuserrelationwrapper.jsx";

import CheckoutPage from "./checkoutpaymentcomponent/checkoutpagecode.jsx";
import PaymentDetails from "./adminpanelcomponent/paymentdetaisuser.jsx";
import AdminDashboardUI from "./adminpanelcomponent/adminpaymentstatus.jsx";
import TermsAndCondition from "./termsandaboutcomponent/termsandconditions.jsx";
import AboutDrip from "./termsandaboutcomponent/aboutdripco.jsx";


import NewArrivalAsNew from "./newarraivalscomponent/newarraivalsmain.jsx";
/* ---------- ProductRouter (OLD - keep exactly as it is) ---------- */
 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />

        <div className="App">
          <Navbar toggleSidebar={toggleSidebar} />
          {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />}

          <div className="app">
            <Routes>
              {/* Homepage */}
              <Route
                path="/"
                element={
                  <>
                    <br /><br /><br /><br /><br />
                    <MainContent />
                    <Productlayout />
                    <Designated />
                    <Productlayout2 />
                    <Productlayout3 />
                    <ProductlayoutMain />
                    <ReutrnsCode />
                  </>
                }
              />

              {/* OLD static product pages (keep them) */}
              
              {/* NEW DYNAMIC PRODUCT PAGE - ADD THIS LINE */}
              <Route path="/product/:id" element={<Productpagemainwrapper />} />

              {/* Cart */}
              <Route path="/productcart" element={<ProductCart />} />

              {/* Checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Admin */}
              <Route path="/adminpanel/SGVsbG8gYWRtaW4sIHRoaXMgaXMgZW5jcnlwdGVkIG9yZGVyICM5ODc2NQ==dripco" element={<AdminPanel />} />  {/*useradminfor product upload*/}

              {/* Category */}
              <Route path="/category/:category" element={<CategoryPage />} />
                   <Route path="/supportdripco" element={<SupportPage />} />

              {/* New Arrivals */}
              <Route path="/new-arrivals" element={<NewArrivals />} />  

               <Route path="/myaccount" element={<MyOrders />} />  {/*user orders storage*/}
                

                 <Route path="/userlogindetails" element={<UserDetail />} /> {/*logined users data*/}

                  <Route path="/useraddressdetailsall" element={<UserAddresses />} /> {/*useraddress after order*/}

                    <Route path="/userordersdetailsall" element={<UserOrders />} /> {/*orders ordered*/}
                     <Route path="/productiddataadmin" element={<ProductIdAdminData />} />  {/*product id admin data */}


<Route path="/dripcopaymentstatus//mV0IEFQSSBkYXRhOiB7status=50489WUiOiJKb2huIiwgInJvbGUiOiJhZG1pbiJ9" element={<AdminDashboardUI />} />

                     <Route path="/orders/U3VwZXIgc2Vjc//mV0IEFQSSBkYXRhOiB7Im5hb=50489WUiOiJKb2huIiwgInJvbGUiOiJhZG1pbiJ9" element={<AdminUserRelationshipWrapper />} />  {/*product id admin data */}

 <Route path="/terms&conditionsdripco" element={<TermsAndCondition />} />
  <Route path="/aboutdripcostore" element={<AboutDrip />} />


<Route path="/newarraivalsdripco" element={<NewArrivalAsNew />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;