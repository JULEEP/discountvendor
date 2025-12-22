import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const printRef = useRef();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 flex justify-center">
            <div className="max-w-6xl w-full">



                {/* Back Button - Top Left */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Registration
                    </button>
                </div>

                {/* Modern Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">R</span>
                                </div>
                                <span className="text-white/90 text-sm font-medium tracking-wider">OFFICIAL AGREEMENT</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Redeemly Merchant Participation Agreement
                            </h1>
                            <p className="text-blue-100 mt-3 text-lg">
                                Commercial Terms & Conditions
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-white text-sm font-medium">Effective Date</p>
                            <p className="text-white text-2xl font-bold">Upon Signature</p>
                        </div>
                    </div>
                </div>

                {/* Agreement Container with Glass Morphism */}
                <div
                    ref={printRef}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40 p-6 md:p-10"
                >
                    {/* Parties Section */}
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">R</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Redemly Platform</h3>
                                </div>
                                <p className="text-gray-700">
                                    <strong className="text-blue-600">Pixelmind, LLC</strong> ("Redemly", "Company", "Platform")
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                    A digital facilitation and marketing platform connecting consumers with local businesses.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <span className="text-emerald-600 font-bold">M</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Merchant / Vendor</h3>
                                </div>
                                <p className="text-gray-700">
                                    <strong className="text-emerald-600">Details provided during onboarding</strong>
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Local business participating in the Redemly promotional network.
                                </p>
                            </div>
                        </div>

                        {/* Agreement Notice */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-2">Agreement Acceptance</h4>
                                    <p className="text-gray-700">
                                        By signing this Agreement, Merchant agrees to participate in the Redemly platform subject to the following terms and conditions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative py-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-6 bg-white text-gray-500 text-sm font-semibold tracking-wider">
                                TERMS & CONDITIONS
                            </span>
                        </div>
                    </div>

                    {/* Agreement Sections */}
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div className="group hover:bg-blue-50/50 p-6 rounded-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <span className="text-white font-bold text-xl">01</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Purpose of the Agreement</h2>
                                    <p className="text-gray-600">
                                        Redemly operates a digital facilitation and marketing platform that connects consumers with local businesses through promotional coupons, rewards, and engagement-based offers.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700">
                                        Redemly does <strong className="text-blue-600">not</strong> sell food, products, or services and does <strong className="text-blue-600">not</strong> control Merchant operations.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700">
                                        Merchant agrees to offer discounts or promotions to Redemly users in accordance with this Agreement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="group hover:bg-blue-50/50 p-6 rounded-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <span className="text-white font-bold text-xl">02</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Merchant Obligations</h2>
                                </div>
                            </div>

                            {/* Sub-sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800">Coupon Acceptance</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">•</span>
                                            <span className="text-gray-700">Honor all valid Redemly coupons</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">•</span>
                                            <span className="text-gray-700">Accept without delay or refusal</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">•</span>
                                            <span className="text-gray-700">Maintain consistent quality</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800">Quality Standards</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">•</span>
                                            <span className="text-gray-700">Consistent food & service quality</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">•</span>
                                            <span className="text-gray-700">No reduction for coupon users</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">•</span>
                                            <span className="text-gray-700">Maintain hygiene standards</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800">Non-Discrimination</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span>
                                            <span className="text-gray-700">Equal pricing & service</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span>
                                            <span className="text-gray-700">No biased treatment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span>
                                            <span className="text-gray-700">Fair product availability</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800">Staff Training</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span className="text-gray-700">Inform all relevant staff</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span className="text-gray-700">Train on redemption procedures</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span className="text-gray-700">Ensure policy awareness</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 & 4 - Side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 3 */}
                            <div className="group hover:bg-blue-50/50 p-6 rounded-xl transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                            <span className="text-white font-bold text-xl">03</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discount & Pricing Terms</h2>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 font-bold">15%</span>
                                            </div>
                                            <h4 className="font-bold text-gray-800">Minimum Discount</h4>
                                        </div>
                                        <p className="text-gray-700 text-sm">Unless otherwise mutually agreed in writing</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                                        <p className="text-gray-700">
                                            <strong className="text-blue-600">Applied before tax</strong> unless explicitly stated otherwise
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                                        <p className="text-gray-700">
                                            Merchant retains <strong className="text-blue-600">full control</strong> over menu pricing
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="group hover:bg-blue-50/50 p-6 rounded-xl transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                            <span className="text-white font-bold text-xl">04</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fees & Payments</h2>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-emerald-50 to-white p-4 rounded-lg border border-emerald-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <span className="text-emerald-600 font-bold">$1</span>
                                            </div>
                                            <h4 className="font-bold text-gray-800">Per Redeemed Coupon</h4>
                                        </div>
                                        <p className="text-gray-700 text-sm">Unless otherwise agreed</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-50 to-white p-4 rounded-lg border border-emerald-200">
                                        <p className="text-gray-700">
                                            <strong className="text-emerald-600">No subscription fees</strong> or upfront onboarding fees
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-50 to-white p-4 rounded-lg border border-emerald-200">
                                        <p className="text-gray-700">
                                            Periodic invoicing based on <strong className="text-emerald-600">redemption activity</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-300 p-8 mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Acceptance & Signatures</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Merchant Signature */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Merchant / Vendor</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Merchant Name</p>
                                            <div className="h-8 border-b border-dashed border-gray-400"></div>
                                        </div>
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Authorized Signatory</p>
                                            <div className="h-8 border-b border-dashed border-gray-400"></div>
                                        </div>
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Signature</p>
                                            <div className="h-16 border-b border-dashed border-gray-400"></div>
                                        </div>
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Date</p>
                                            <div className="h-8 border-b border-dashed border-gray-400"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Redemly Signature */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Pixelmind, LLC (Redemly)</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Authorized Representative</p>
                                            <div className="h-8 border-b border-dashed border-gray-400"></div>
                                        </div>
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Signature</p>
                                            <div className="h-16 border-b border-dashed border-gray-400"></div>
                                        </div>
                                        <div className="border-b border-gray-300 pb-3">
                                            <p className="text-sm text-gray-500 mb-1">Date</p>
                                            <div className="h-8 border-b border-dashed border-gray-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-8 pt-6 border-t border-gray-300">
                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">This Agreement constitutes the entire understanding between the parties</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Pixelmind, LLC. All rights reserved. |
                        <span className="text-gray-600 font-medium"> Governing Law: State of Texas, USA</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Document Version: 2.1 | Last Updated: December 2024
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;