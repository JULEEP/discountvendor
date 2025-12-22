import { useState, useEffect, useRef } from "react";
import {
  MdShoppingCart,
} from "react-icons/md";
import {
  RiMenu2Line,
  RiMenu3Line,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiNotification3Fill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setIsCollapsed, isCollapsed }) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  const [productRequests, setProductRequests] = useState(0);
  const [orderRequests, setOrderRequests] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Get vendorId from localStorage
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (vendorId) {
          const notifRes = await axios.get(`https://api.redemly.com/api/vendor/notifications/${vendorId}`);
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

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const toggleFullscreen = () => {
    const element = document.documentElement; // Full page

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcut for fullscreen (F11)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Escape key to exit fullscreen
      if (e.key === 'Escape' && document.fullscreenElement) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          {/* Fullscreen Button */}
          <button 
            onClick={toggleFullscreen}
            className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 duration-300 text-white flex items-center gap-2"
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
          >
            {isFullscreen ? (
              <RiFullscreenExitLine className="text-lg" />
            ) : (
              <RiFullscreenLine className="text-lg" />
            )}
            <span className="text-xs hidden sm:inline">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>

          {/* Logo + Redemly title on the right side */}
          <div className="flex items-center gap-2 pr-4">
            <img
              src="/discount logo.png"
              alt="Vendor Logo"
              className="w-[40px] h-auto"
            />
            <span className="text-white font-bold text-lg">Redemly</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;