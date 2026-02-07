"use client";

import { useState } from "react";

export default function SalaryPage() {
  const [treasury, setTreasury] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [payoutResults, setPayoutResults] = useState<any[]>([]);
  const [amount, setAmount] = useState("0.1"); // Default USDC per recipient
  const [recipientName, setRecipientName] = useState("");

  // Create Treasury
  const createTreasury = async () => {
    const res = await fetch("/api/salary/create-treasury", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setTreasury(data.treasury);
      alert(`Treasury created! Address: ${data.treasury.address} - Fund it via faucet.`);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  // Add Recipient
  const addRecipient = async () => {
    // Validate wallet address
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(recipientName)) {
      alert("Error: Invalid wallet address. Must start with 0x and be 42 characters long.");
      return;
    }

    const res = await fetch("/api/salary/add-recipient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: recipientName }),
    });
    const data = await res.json();
    if (data.success) {
      setRecipients([...recipients, data.recipient]);
      setRecipientName("");
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  // Execute Payroll
  const executePayroll = async () => {
    const res = await fetch("/api/salary/execute-payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountPerRecipient: amount }),
    });
    const data = await res.json();
    if (data.success) {
      setPayoutResults(data.payouts);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SalArcy Dashboard</h1>

      {/* Step 1: Create Treasury */}
      {!treasury && (
        <button className="btn btn-primary mb-4" onClick={createTreasury}>
          Create Treasury Wallet
        </button>
      )}
      {treasury && (
        <p className="mb-4">Treasury Address: {treasury.address} (Fund with test USDC via faucet)</p>
      )}

      {/* Step 2: Add Recipients */}
      {treasury && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Recipient Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="input input-bordered mr-2"
          />
          <button className="btn btn-secondary" onClick={addRecipient}>
            Add Recipient
          </button>
          <ul className="mt-2">
            {recipients.map((rec, i) => (
              <li key={i}>{rec.name}: {rec.address}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 3: Execute Payroll */}
      {recipients.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Amount per Recipient (USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered mr-2"
          />
          <button className="btn btn-success" onClick={executePayroll}>
            Execute Payroll
          </button>
        </div>
      )}

      {/* Results */}
      {payoutResults.length > 0 && (
        <div>
          <h2 className="text-2xl mb-2">Payout Results</h2>
          <ul>
            {payoutResults.map((res, i) => (
              <li key={i}>
                {res.recipient}: {res.success ? `Success - Tx ID: ${res.tx.transaction.id}` : `Error: ${res.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}