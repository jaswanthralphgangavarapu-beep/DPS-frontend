// PaymentDetails.jsx
import React, { useState, useEffect } from "react";
import "../adminpanelcomponent/paymentdesign.css";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load checkbox status from localStorage
  const loadCheckboxState = (paymentId, key) => {
    return localStorage.getItem(`${paymentId}_${key}`) === "true";
  };

  // Save checkbox status in localStorage
  const saveCheckboxState = (paymentId, key, value) => {
    localStorage.setItem(`${paymentId}_${key}`, value);
  };

  useEffect(() => {
    fetch("http://195.35.45.56:4646/api/payments/all")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch payments");
        return response.json();
      })
      .then((data) => {
        // Add saved checkbox values into each payment object
        const updatedData = data.map((payment) => ({
          ...payment,
          orderPlaced: loadCheckboxState(payment.id, "orderPlaced"),
          orderPacked: loadCheckboxState(payment.id, "orderPacked"),
        }));

        setPayments(updatedData);
        setFilteredPayments(updatedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Search Filter
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    if (searchTerm.trim() === "") {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter((p) =>
      Object.values(p).some(
        (value) => value && value.toString().toLowerCase().includes(lower)
      )
    );

    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  if (loading) return <div className="paymentDash-loading">Loading...</div>;
  if (error) return <div className="paymentDash-error">{error}</div>;

  return (
    <div className="paymentDash-container">
      <br /><br /><br /><br />

      <h1 className="paymentDash-heading">Payment Details Dashboard</h1>

      {/* Search Bar */}
      <div className="paymentDash-searchSection">
        <input
          type="text"
          placeholder="Search by any field (payment ID, email, name, phone...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="paymentDash-searchInput"
        />
      </div>

      <div className="paymentDash-tableWrapper">
        <table className="paymentDash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Razorpay Order</th>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Bank RRN</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Signature</th>
              <th>Created At</th>

              {/* New Columns */}
              <th>Order Placed</th>
              <th>Order Packed</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.paymentId}</td>
                <td>{payment.orderId}</td>
                <td>{payment.razorpayOrderId}</td>
                <td>{payment.userId}</td>
                <td>{payment.productId}</td>
                <td>{payment.bankRrn}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.currency}</td>

                {/* Status Tag */}
                <td>
                  <span
                    className={
                      payment.status === "paid"
                        ? "tag-paid"
                        : payment.status === "failed"
                        ? "tag-failed"
                        : "tag-pending"
                    }
                  >
                    {payment.status}
                  </span>
                </td>

                <td>{payment.paymentMethod}</td>
                <td>{payment.customerName}</td>
                <td>{payment.customerEmail}</td>
                <td>{payment.customerPhone}</td>
                <td>{payment.signature}</td>
                <td>{payment.createdAt}</td>

                {/* Order Placed Checkbox */}
                <td>
                  <input
                    type="checkbox"
                    checked={payment.orderPlaced || false}
                    onChange={(e) => {
                      const value = e.target.checked;

                      saveCheckboxState(payment.id, "orderPlaced", value);

                      setPayments((prev) =>
                        prev.map((p) =>
                          p.id === payment.id ? { ...p, orderPlaced: value } : p
                        )
                      );
                    }}
                  />
                </td>

                {/* Order Packed Checkbox */}
                <td>
                  <input
                    type="checkbox"
                    checked={payment.orderPacked || false}
                    onChange={(e) => {
                      const value = e.target.checked;

                      saveCheckboxState(payment.id, "orderPacked", value);

                      setPayments((prev) =>
                        prev.map((p) =>
                          p.id === payment.id ? { ...p, orderPacked: value } : p
                        )
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetails;
