import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SalArcy Dashboard",
  description: "Global USDC Payroll on Arc",
};

export default function SalaryPage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">SalArcy Dashboard</h1>
      <p>Manage your treasury and payroll here.</p>
      {/* Ici, on ajoutera les boutons/forms pour appeler les endpoints plus tard */}
    </div>
  );
}