import React, { useState } from 'react';
import UserDetail from '../adminpanelcomponent/userdetails';
import ProductIdAdminData from '../adminpanelcomponent/productdetailsadmin';
import UserOrders from '../adminpanelcomponent/userorders';
import UserAddresses from '../adminpanelcomponent/useraddresscomponent';
import '../adminpanelcomponent/adminuserrelationdesign.css';
import PaymentDetails from '../adminpanelcomponent/paymentdetaisuser';

const AdminUserRelationshipWrapper = () => {
    const [activeTab, setActiveTab] = useState(null);  

    const tabs = [
        { id: 'users', label: 'Elite Members', component: <UserDetail /> },
        { id: 'products', label: 'Products', component: <ProductIdAdminData /> },
        { id: 'orders', label: 'Orders', component: <UserOrders /> },
        { id: 'addresses', label: 'Addresses', component: <UserAddresses /> },
        { id: 'payments', label: 'Payment Orders', component: <PaymentDetails /> }
    ];

    const selectedComponent = tabs.find(t => t.id === activeTab)?.component;

    return (
        <div className="admin-wrapper">
        <br/><br/><br/><br/>
            <div className="admin-header">
                <h1 className="admin-title">Drip Co. Admin</h1>
                <p className="admin-subtitle">Select a section to manage</p>
            </div>

            {/* Tab Buttons */}
            <div className="tab-container">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            borderRadius: index === 0 ? '8px 0 0 8px' : 
                                       index === tabs.length - 1 ? '0 8px 8px 0' : '0'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Active Indicator */}
            {activeTab && (
                <div className="indicator-line" style={{ 
                    transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)` 
                }} />
            )}

            {/* Main Content Area */}
            <div className="tab-content-area">
                {selectedComponent ? (
                    selectedComponent
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">Select</div>
                        <h2>Select a tab above to view details</h2>
                        <p>Choose from Elite Members, Products, Orders, or Addresses</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserRelationshipWrapper;