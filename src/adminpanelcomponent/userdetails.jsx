import React, { useState, useEffect } from 'react';
import '../adminpanelcomponent/desinguserdetails.css';

const UserDetail = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://195.35.45.56:4646/api/v2/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        credentials: 'include', // Sends cookies
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Forbidden / Not Found'}`);
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.userId.includes(term) ||
      user.phoneNumber.includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (loading) {
    return <div className="loading">Fetching Elite Members...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Access Denied or Server Error</h2>
        <p>{error}</p>
        <button onClick={fetchUsers} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
    <br/><br/><br/> <br/><br/>
      <div className="header-section">
        <h1 className="title">Drip Co. Elite Members</h1>
        <p className="subtitle">Exclusive Directory • {users.length} Members</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search name, User ID, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">Search</span>
      </div>

      <div className="table-wrapper">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="user-row">
                <td>{index + 1}</td>
                <td className="userid">#{user.userId}</td>
                <td className="name">{user.name}</td>
                <td>{user.phoneNumber}</td>
                <td>{new Date(user.registeredDateTime).toLocaleString()}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="no-results">No members found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;