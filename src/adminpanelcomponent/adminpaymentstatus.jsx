import React, { useEffect, useState } from "react";
import "../adminpanelcomponent/adminpaymentstatusdesing.css";
import AdminUserRelationshipWrapper from "./adminuserrelationwrapper";

const AdminDashboardUI = () => {
  const [stats, setStats] = useState({
    collectedAmount: 0,
    totalCapturedPayments: 0,
    failedPayments: 0,
    refundsAmount: 0,
    disputesAmount: 0,
    paymentMethods: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://195.35.45.56:4646/api/payments/all", {
          credentials: "include", // Important for session/auth if needed
        });

        if (!response.ok) throw new Error("Failed to fetch payments");

        const payments = await response.json();

        // Calculate stats from real data
        let collected = 0;
        let capturedCount = 0;
        let failedCount = 0;
        const methods = {};

        payments.forEach((payment) => {
          if (payment.status === "paid") {
            collected += payment.amount;
            capturedCount++;
            methods[payment.paymentMethod] = (methods[payment.paymentMethod] || 0) + 1;
          } else if (payment.status === "failed" || payment.status === "attempted") {
            failedCount++;
          }
        });

        // Convert method counts to percentage
        const totalPaid = Object.values(methods).reduce((a, b) => a + b, 0);
        const methodPercentages = {};
        if (totalPaid > 0) {
          Object.keys(methods).forEach((key) => {
            methodPercentages[key] = Math.round((methods[key] / totalPaid) * 100);
          });
        } else {
          methodPercentages["UPI"] = 100; // fallback
        }

        // Find dominant method for donut chart
        const dominantMethod = Object.keys(methodPercentages).sort(
          (a, b) => methodPercentages[b] - methodPercentages[a]
        )[0] || "UPI";

        setStats({
          collectedAmount: collected,
          totalCapturedPayments: capturedCount,
          failedPayments: failedCount,
          refundsAmount: 0, // You can add refund logic later
          disputesAmount: 0,
          paymentMethods: methodPercentages,
          dominantMethod: dominantMethod,
          dominantPercent: methodPercentages[dominantMethod] || 100,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error loading payments:", err);
        setStats((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchPayments();
  }, []);

  if (stats.loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (stats.error) {
    return <div className="error">Error: {stats.error}</div>;
  }

  return (
    <div className="admin-dashboard">
    <br/>/<br/> <br/>/<br/> <br/>
      <div className="dashboard-header">
        <h2>Overview Today</h2>
        <a
          href="https://dashboard.razorpay.com/app/payments?from=1764009000&to=1764700199&id=cap"
          target="_blank"
          rel="noopener noreferrer"
          className="docs-link"
        >
          View in RazorPay
        </a>
      </div>

      <div className="stats-grid">
        {/* Collected Amount */}
        <div className="card collected-card">
          <div className="card-title">Collected Amount</div>
          <div className="amount-large">
            ₹{stats.collectedAmount.toFixed(2)}
          </div>
          <div className="subtitle">
            from {stats.totalCapturedPayments} captured{" "}
            {stats.totalCapturedPayments === 1 ? "payment" : "payments"}
          </div>
          <div className="footer-note">
            Net settlement amount will be deposited as per your settlement cycle
          </div>
        </div>

        {/* Payment Method Split */}
        <div className="card method-card">
          <div className="card-title">Split by payment method</div>
          <div className="chart-container">
            <div className="donut-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 1 1 0 31.831
                     a 15.9155 15.9155 0 1 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${stats.dominantPercent}, 100`}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 1 1 0 31.831
                     a 15.9155 15.9155 0 1 1 0 -31.831"
                />
              </svg>
              <div className="chart-label">
                <span className="method-name">{stats.dominantMethod || "UPI"}</span>
                <span className="method-percent">{stats.dominantPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="bottom-cards">
        <div className="small-card refunds">
          <div className="icon refund-icon"></div>
          <div className="content">
            <div className="title">Refunds</div>
            <div className="amount">₹{stats.refundsAmount.toFixed(2)}</div>
            <div className="detail">0 processed</div>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="small-card disputes">
          <div className="icon dispute-icon"></div>
          <div className="content">
            <div className="title">Disputes</div>
            <div className="amount">₹{stats.disputesAmount.toFixed(2)}</div>
            <div className="detail">0 open • 0 under review</div>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="small-card failed">
          <div className="icon failed-icon"></div>
          <div className="content">
            <div className="title">Failed</div>
            <div className="count">{stats.failedPayments}</div>
            <div className="detail">payments</div>
          </div>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="footer-banner">
        <span className="star-icon">★</span>
        <span className="text">
          Pay 0% fee on transactions up to ₹75,000/mo. Then, just 1.9% per
          transaction (25% lower).
        </span>
        <a href="#" className="plus-link">
          View Plus plan →
        </a>
      </div>
      <div>
        <AdminUserRelationshipWrapper/>
      </div>
    </div>
  );
};

export default AdminDashboardUI;