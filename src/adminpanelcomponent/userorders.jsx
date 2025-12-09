import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../adminpanelcomponent/userordersdesign.css";

const order_api_url = "http://195.35.45.56:4646";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${order_api_url}/api/orders/get/allorders`);
            setOrders(response.data);
            setFiltered(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load orders. Check if backend is running on port 4646');
            setLoading(false);
            console.error("Error:", err);
        }
    };

    // Enhanced Search - Covers ALL fields
    useEffect(() => {
        if (!search) {
            setFiltered(orders);
            return;
        }
        const term = search.toLowerCase();
        const result = orders.filter(order =>
            order.orderId.toLowerCase().includes(term) ||
            order.userId.toLowerCase().includes(term) ||
            order.productId.toLowerCase().includes(term) ||
            order.productTitle.toLowerCase().includes(term) ||
            (order.productCategory && order.productCategory.toLowerCase().includes(term)) ||
            (order.productSize && order.productSize.toLowerCase().includes(term)) ||
            order.addressId.toLowerCase().includes(term) ||
            order.status.toLowerCase().includes(term) ||
            order.unitPrice.toString().includes(term) ||
            order.quantity.toString().includes(term) ||
            order.subtotal.toString().includes(term)
        );
        setFiltered(result);
    }, [search, orders]);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED': return 'status-placed';
            case 'PENDING': return 'status-pending';
            case 'SHIPPED': return 'status-shipped';
            case 'DELIVERED': return 'status-delivered';
            case 'CANCELLED': return 'status-cancelled';
            case 'RETURNED': return 'status-returned';
            default: return 'status-default';
        }
    };

    if (loading) return <div className="loading">Loading Orders...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="orders-container">
        <br/><br/><br/>
            <h2 className="title">All Customer Orders</h2>
            <p className="subtitle">Complete order history with full product & delivery details</p>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Order ID, User ID, Product ID, Title, Category, Address, Status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <span className="search-icon">Search</span>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Product ID</th>
                            <th>Product Title</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                            <th>Address ID</th>
                            <th>Status</th>
                            <th>Placed On</th>
                            <th>Updated On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="13" className="no-data">
                                    {search ? "No orders match your search." : "No orders found in the system."}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((order) => (
                                <tr key={order.id} className="order-row">
                                    <td><strong className="order-id">{order.orderId}</strong></td>
                                    <td><code className="user-code">{order.userId}</code></td>
                                    <td><code className="pid">{order.productId}</code></td>
                                    <td className="product-title">{order.productTitle}</td>
                                    <td>{order.productCategory || "-"}</td>
                                    <td>{order.productSize || "-"}</td>
                                    <td><strong>{order.quantity}</strong></td>
                                    <td>₹{Number(order.unitPrice).toFixed(2)}</td>
                                    <td><strong className="subtotal">₹{Number(order.subtotal).toFixed(2)}</strong></td>
                                    <td><code className="address-code">{order.addressId}</code></td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{new Date(order.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="summary">
                Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> total orders
            </div>
        </div>
    );
};

export default UserOrders;