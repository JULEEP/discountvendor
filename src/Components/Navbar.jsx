import { useState, useEffect } from "react";
import {
  MdShoppingCart,
} from "react-icons/md";
import {
  RiMenu2Line,
  RiMenu3Line,
  RiFullscreenLine,
  RiNotification3Fill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/discount logo.png"; // ✅ Local logo

const Navbar = ({ setIsCollapsed, isCollapsed }) => {
  const navigate = useNavigate();

  const [productRequests, setProductRequests] = useState(0);
  const [orderRequests, setOrderRequests] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Get vendorId from localStorage
  const vendorId = localStorage.getItem("vendorId");

useEffect(() => {
  const fetchCounts = async () => {
    try {
      if (vendorId) {
        const notifRes = await axios.get(`http://31.97.206.144:6098/api/vendor/notifications/${vendorId}`);
        const count = notifRes.data.data?.length || 0;
        setNotificationCount(count);
        console.log(`Notification count for vendor ${vendorId}:`, count);
      } else {
        setNotificationCount(0);
        console.warn("Vendor ID not found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  fetchCounts();
}, [vendorId]);


  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <nav className="bg-blue-800 text-white sticky top-0 w-full h-20 px-4 flex items-center shadow-md z-50">
      {/* Sidebar toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-xl p-2 text-white mr-3"
      >
        {isCollapsed ? <RiMenu2Line className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
      </button>

      {/* 🔔 Notifications button */}
      <div
        className="flex items-center gap-2 cursor-pointer mr-6"
        onClick={handleNotificationClick}
      >
        <div className="relative">
          <RiNotification3Fill className="text-2xl text-white hover:text-yellow-300 transition duration-200" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold">Notifications</span>
      </div>

      {/* Right side */}
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 ml-4">{/* Reserved space */}</div>

        <div className="flex gap-3 items-center">
          <button className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 duration-300 text-white">
            <RiFullscreenLine />
          </button>

          {/* Logo + Redemly title on the right side */}
      <div className="flex items-center gap-2 pr-4">
        <img
          src="/discount logo.png"
          alt="Vendor Logo"
          className="w-[40px] h-auto" // No border or circle
        />
        <span className="text-white-400 font-bold text-lg">Redemly</span>
      </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
