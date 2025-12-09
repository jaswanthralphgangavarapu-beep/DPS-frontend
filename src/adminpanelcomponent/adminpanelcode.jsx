import React, { useState, useEffect } from 'react';
import '../adminpanelcomponent/adminpanel.css';

const API_BASE = "http://195.35.45.56:4646";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    productId: "",
    title: "",
    category: "PANT'S",
    price: "",
    previousPrice: "",
    stock: "",
    description: "",
    size: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === "dripcoshanawazadmin11") { // Change this or make secure later
      setIsLoggedIn(true);
    } else {
      alert("Wrong password!");
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/all`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const handleImageSelect = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !editingProduct) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("productId", form.productId || "");
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("previousPrice", form.previousPrice || 0);
    formData.append("stock", form.stock || 0);
    formData.append("description", form.description);
    formData.append("size", form.size || "");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let url = editingProduct
        ? `${API_BASE}/api/products/update-image/${editingProduct.id}`
        : `${API_BASE}/api/products/create`;

      let method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        alert(editingProduct ? "Product Updated!" : "Product Added!");
        setShowForm(false);
        setEditingProduct(null);
        setImageFile(null);
        setForm({
          productId: "", title: "", category: "PANT'S", price: "", previousPrice: "",
          stock: "", description: "", size: ""
        });
        fetchProducts();
      } else {
        const error = await res.text();
        alert("Error: " + error);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      productId: product.productId,
      title: product.title,
      category: product.category,
      price: product.price,
      previousPrice: product.previousPrice || "",
      stock: product.stock,
      description: product.description || "",
      size: product.size || ""
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`${API_BASE}/api/products/${deleteId}`, { method: "DELETE" });
      alert("Product deleted!");
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="dripco-login-page">
        <div className="dripco-login-modal">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="dripco-form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="dripco-submit-btn">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <br /><br /><br /><br />

      <header className="panel-header">
        <h1>Product Management (Live DB)</h1>
        <button className="add-btn" onClick={() => {
          setShowForm(true);
          setEditingProduct(null);
          setImageFile(null);
          setForm({ productId: "", title: "", category: "PANT'S", price: "", previousPrice: "", stock: "", description: "", size: "" });
        }}>
          + Add Product
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Image *</label>
              <input type="file" accept="image/*" onChange={handleImageSelect} required={!editingProduct} />
              {editingProduct && imageFile && <p>Selected: {imageFile.name}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="PANT'S">PANT'S</option>
                  <option value="TSHIRT'S">TSHIRT'S</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Previous Price (₹)</label>
                <input type="number" step="0.01" value={form.previousPrice} onChange={e => setForm({ ...form, previousPrice: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock *</label>
                <input type="number" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Size (Optional)</label>
                <input type="text" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Saving..." : (editingProduct ? "Update" : "Add Product")}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="modern-table-container">
        <h2>All Products ({products.length})</h2>
        {products.length === 0 ? (
          <p>No products in database yet.</p>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img src={`${API_BASE}${p.imageUrl}`} alt={p.title} style={{ width: 60, height: 60, objectFit: "cover" }} />
                    ) : "No Image"}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price} {p.previousPrice && <del>₹{p.previousPrice}</del>}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => startEdit(p)} className="edit-btn-modern">Edit</button>
                    <button onClick={() => { setDeleteId(p.id); setShowDeleteModal(true); }} className="delete-btn-modern">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteModal && (
        <div className="dripco-delete-page">
          <div className="dripco-delete-modal">
            <h2>Delete Product?</h2>
            <p>This cannot be undone.</p>
            <button onClick={confirmDelete} className="dripco-confirm-btn">Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="dripco-cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;