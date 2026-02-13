"use client";

import { useState } from "react";

export default function NewPayrollPage() {
  const [amount, setAmount] = useState("0.1"); // Default USDC per recipient
  const [payoutResults, setPayoutResults] = useState<any[]>([]);

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
      // Optional: Save to localStorage for view-transactions
      const storedTx = localStorage.getItem("salarcyTransactions") || "[]";
      const transactions = JSON.parse(storedTx);
      const newTxs = data.payouts.map((p: any) => ({
        id: p.tx?.transaction?.id || "N/A",
        recipient: p.recipient,
        amount: amount,
      }));
      localStorage.setItem("salarcyTransactions", JSON.stringify([...transactions, ...newTxs]));
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">New Payroll</h1>

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

      {/* Results */}
      {payoutResults.length > 0 && (
        <div>
          <h2 className="text-2xl mb-2">Payout Results</h2>
          <ul>
            {payoutResults.map((res, i) => (
              <li key={i}>
                {res.recipient}: {res.success ? `Success - Tx ID: ${res.tx?.transaction?.id || "N/A"}` : `Error: ${res.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}