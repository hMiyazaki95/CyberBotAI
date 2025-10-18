import React from "react";
import "../css/ModalWrapper.css";

interface Props {
  onClose: () => void;
}

const SubscriptionModal: React.FC<Props> = ({ onClose }) => {
  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("❌ Failed to create Stripe checkout session.");
      }
    } catch (err) {
      console.error("❌ Stripe redirect error:", err);
      alert("Failed to start subscription process.");
    }
  };

  return (
    <div className="modal">
        <div className="subscription-modal">
            <h2>🔒 Unlock Unlimited Access</h2>
            <p>You’ve used your 5 free messages. Subscribe to continue using CyberBot.</p>

            <button className="modal-button" onClick={handleSubscribe}>
            Upgrade for $10/month
            </button>
            <button className="modal-button secondary" onClick={onClose}>
            Maybe Later
            </button>
        </div>
    </div>

  );
};

export default SubscriptionModal;
