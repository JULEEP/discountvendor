import { useState } from "react";
import jsPDF from "jspdf";

export default function VendorInvoiceDashboard() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      vendorName: "Vendor One",
      month: "April 2025",
      redeemedCoupons: 30,
      amount: 30,
      status: "Pending",
    },
    {
      id: 2,
      vendorName: "Vendor One",
      month: "March 2025",
      redeemedCoupons: 25,
      amount: 25,
      status: "Paid",
    },
  ]);

  const handlePayment = (id) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Paid" } : invoice
      )
    );
    alert("Payment successful. Thank you!");
  };

  const handleDownload = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Vendor Coupon Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 40);
    doc.text(`Vendor Name: ${invoice.vendorName}`, 20, 50);
    doc.text(`Month: ${invoice.month}`, 20, 60);
    doc.text(`Coupons Redeemed: ${invoice.redeemedCoupons}`, 20, 70);
    doc.text(`Amount: $${invoice.amount}`, 20, 80);
    doc.text(`Status: ${invoice.status}`, 20, 90);

    doc.text("Thank you for your participation!", 20, 110);

    doc.save(`Invoice_${invoice.vendorName}_${invoice.month}.pdf`);
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        My Invoices
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Coupons Redeemed</th>
              <th className="p-2 border">Amount ($)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{invoice.month}</td>
                <td className="p-2 border">{invoice.redeemedCoupons}</td>
                <td className="p-2 border">${invoice.amount}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      invoice.status === "Paid"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  {invoice.status === "Pending" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handlePayment(invoice.id)}
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDownload(invoice)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
