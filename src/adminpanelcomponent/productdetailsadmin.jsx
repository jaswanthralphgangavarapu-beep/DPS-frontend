import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminpanelcomponent/productiddesign.css';

const product_api_url = "http://195.35.45.56:4646";

const ProductIdAdminData = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${product_api_url}/api/products/all`);
            setProducts(res.data);
            setFiltered(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load products. Is backend running?');
            setLoading(false);
            console.error(err);
        }
    };

    // Search across all fields
    useEffect(() => {
        const term = search.toLowerCase();
        const result = products.filter(p =>
            p.productId.toLowerCase().includes(term) ||
            p.title.toLowerCase().includes(term) ||
            (p.category && p.category.toLowerCase().includes(term)) ||
            p.price.toString().includes(term) ||
            p.previousPrice.toString().includes(term) ||
            p.stock.toString().includes(term) ||
            (p.size && p.size.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
        setFiltered(result);
    }, [search, products]);

    const handleDelete = async (productId) => {
        if (!window.confirm(`Delete product "${productId}" permanently?`)) return;

        setDeletingId(productId);
        try {
            await axios.delete(`${product_api_url}/api/products/deleteByProductId/${productId}`);
            setProducts(prev => prev.filter(p => p.productId !== productId));
            setFiltered(prev => prev.filter(p => p.productId !== productId));
            alert("Product deleted successfully!");
        } catch (err) {
            alert("Failed to delete product");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="prod-loading">Loading products...</div>;
    if (error) return <div className="prod-error">{error}</div>;

    return (
        <div className="prod-container">
        <br/><br/><br/>
            <h2 className="prod-title">All Products - Admin Panel</h2>
            <p className="prod-subtitle">Manage and monitor all products in the store</p>

            {/* Search */}
            <div className="prod-search-box">
                <input
                    type="text"
                    placeholder="Search by Product ID, Title, Category, Price, Stock..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="prod-search-input"
                />
                <span className="prod-search-icon">Search</span>
            </div>

            {/* Table */}
            <div className="prod-table-wrapper">
                <table className="prod-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Old Price</th>
                            <th>Stock</th>
                            <th>Size</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="prod-no-data">
                                    {search ? "No products match your search." : "No products found."}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id} className="prod-row">
                                    <td>
                                        {p.imageUrl ? (
                                            <img
                                                src={`${product_api_url}${p.imageUrl}`}
                                                alt={p.title}
                                                className="prod-image"
                                                onError={(e) => e.target.src = "/placeholder.jpg"}
                                            />
                                        ) : (
                                            <div className="prod-no-image">No Image</div>
                                        )}
                                    </td>
                                    <td><strong className="prod-id">{p.productId}</strong></td>
                                    <td className="prod-title-cell">{p.title}</td>
                                    <td>{p.category || "-"}</td>
                                    <td><strong>₹{Number(p.price).toFixed(2)}</strong></td>
                                    <td><del>₹{Number(p.previousPrice).toFixed(2)}</del></td>
                                    <td>
                                        <span className={`prod-stock ${p.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td>{p.size || "-"}</td>
                                    <td className="prod-desc-cell">
                                        {p.description ? p.description.substring(0, 80) + "..." : "-"}
                                    </td>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(p.productId)}
                                            disabled={deletingId === p.productId}
                                            className="prod-delete-btn"
                                        >
                                            {deletingId === p.productId ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="prod-summary">
                Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products
            </div>
        </div>
    );
};

export default ProductIdAdminData;