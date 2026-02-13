"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => { 
    const storedTx = localStorage.getItem("salarcyTransactions");
    if (storedTx) {
      setTransactions(JSON.parse(storedTx));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SalArcy Dashboard</h1>
      <h2 className="text-2xl mb-4">Latest Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.slice(-5).map((tx, i) => ( // Dernières 5
            <li key={i}>Tx ID: {tx.id} - To: {tx.recipient} - Amount: {tx.amount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}