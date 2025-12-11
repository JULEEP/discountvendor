import React from "react";

const CouponHistoryTable = () => {
 // Static coupon history data
const couponHistory = [
  {
    SI_No: 1,
    Customer_ID: "c685",
    Coupon_ID: "ROwETB",
    Discount: "10%",
    Coupon_Download_Date: "23-09-2025",
    Coupon_Redeemed_Date: "N/A",
    Coupon_Redeemed_Time: "N/A",
    Coupon_Order_Details: "N/A",
    Order_Value: "$0.00",
    Feedback: "N/A"
  },
  {
    SI_No: 2,
    Customer_ID: "c686",
    Coupon_ID: "Rowter",
    Discount: "15%",
    Coupon_Download_Date: "25-10-2025",
    Coupon_Redeemed_Date: "27-10-2025",
    Coupon_Redeemed_Time: "4:00pm",
    Coupon_Order_Details: "Rasmali Falooda, triple chocolate crepes, Mango milk tea",
    Order_Value: "$26",
    Feedback: "Falooda and milk tea were amazing, the crepe could have been better"
  },
  {
    SI_No: 3,
    Customer_ID: "c687",
    Coupon_ID: "Rowter",
    Discount: "15%",
    Coupon_Download_Date: "26-10-2025",
    Coupon_Redeemed_Date: "26-10-2025",
    Coupon_Redeemed_Time: "6:00pm",
    Coupon_Order_Details: "Mutton juicy mandi, Onion samosa, punogulu",
    Order_Value: "$50",
    Feedback: "Mandi was the best, snacks were cold"
  },
  {
    SI_No: 4,
    Customer_ID: "c687",
    Coupon_ID: "Rowter",
    Discount: "15%",
    Coupon_Download_Date: "26-10-2025",
    Coupon_Redeemed_Date: "27-10-2025",
    Coupon_Redeemed_Time: "7:00pm",
    Coupon_Order_Details: "3lb mutton, 5lb chicken",
    Order_Value: "$60",
    Feedback: ""
  }
];

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          Coupon Usage History
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-green-100 text-gray-600">
              <tr>
                <th className="py-2 px-4 border">SI No</th>
                <th className="py-2 px-4 border">Customer ID</th>
                <th className="py-2 px-4 border">Coupon ID</th>
                <th className="py-2 px-4 border">Discount</th>
                <th className="py-2 px-4 border">Coupon Download Date</th>
                <th className="py-2 px-4 border">Coupon Redeemed Date</th>
                <th className="py-2 px-4 border">Coupon Redeemed Time</th>
                <th className="py-2 px-4 border">Coupon Order Details</th>
                <th className="py-2 px-4 border">Order Value</th>
                <th className="py-2 px-4 border">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {couponHistory.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-4 text-gray-500 text-center">
                    No coupon usage history found.
                  </td>
                </tr>
              ) : (
                couponHistory.map((coupon, index) => (
                  <tr key={coupon.Coupon_ID + index} className="text-center">
                    <td className="py-2 px-4 border">{coupon.SI_No || index + 1}</td>
                    <td className="py-2 px-4 border">{coupon.Customer_ID}</td>
                    <td className="py-2 px-4 border">{coupon.Coupon_ID}</td>
                    <td className="py-2 px-4 border">{coupon.Discount}</td>
                    <td className="py-2 px-4 border">{coupon.Coupon_Download_Date}</td>
                    <td className="py-2 px-4 border">{coupon.Coupon_Redeemed_Date}</td>
                    <td className="py-2 px-4 border">{coupon.Coupon_Redeemed_Time}</td>
                    <td className="py-2 px-4 border">{coupon.Coupon_Order_Details}</td>
                    <td className="py-2 px-4 border">{coupon.Order_Value}</td>
                    <td className="py-2 px-4 border">{coupon.Feedback || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponHistoryTable;