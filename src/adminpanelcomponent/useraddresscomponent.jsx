import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminpanelcomponent/useraddress.css';

const address_api = "http://195.35.45.56:4646";

const UserAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${address_api}/api/addresses/getAddressAll`);
            setAddresses(response.data);
            setFiltered(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load addresses. Please try again later.');
            setLoading(false);
            console.error(err);
        }
    };

    // Search functionality
    useEffect(() => {
        const term = search.toLowerCase();
        const result = addresses.filter(addr =>
            addr.user.userId.toLowerCase().includes(term) ||
            addr.addressId.toLowerCase().includes(term) ||
            addr.houseNo?.toLowerCase().includes(term) ||
            addr.city?.toLowerCase().includes(term) ||
            addr.state?.toLowerCase().includes(term) ||
            addr.pincode?.includes(term)
        );
        setFiltered(result);
    }, [search, addresses]);

    if (loading) {
        return <div className="loading">Loading addresses...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="address-container">
        <br/><br/><br/>
            <h2 className="title">User Addresses</h2>

            {/* Search Bar */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search by User ID, Address ID, City, Pincode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <span className="search-icon">Search</span>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="address-table">
                    <thead>
                        <tr>
                            <th>Address ID</th>
                            <th>User ID</th>
                            <th>House No</th>
                            <th>Street</th>
                            <th>Locality</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Pincode</th>
                            <th>Default</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="no-data">
                                    {search ? 'No addresses match your search.' : 'No addresses found.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((addr) => (
                                <tr key={addr.id} className={addr.isDefault ? 'default-row' : ''}>
                                    <td><strong>{addr.addressId}</strong></td>
                                    <td>{addr.user.userId}</td>
                                    <td>{addr.houseNo || '-'}</td>
                                    <td>{addr.street || '-'}</td>
                                    <td>{addr.locality || '-'}</td>
                                    <td>{addr.city}</td>
                                    <td>{addr.state}</td>
                                    <td>{addr.pincode}</td>
                                    <td>
                                        {addr.isDefault ? (
                                            <span className="badge default">Default</span>
                                        ) : (
                                            <span className="badge normal">No</span>
                                        )}
                                    </td>
                                    <td>{new Date(addr.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="summary">
                Showing <strong>{filtered.length}</strong> of <strong>{addresses.length}</strong> addresses
            </div>
        </div>
    );
};

export default UserAddresses;