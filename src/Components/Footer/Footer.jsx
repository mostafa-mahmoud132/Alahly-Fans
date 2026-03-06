import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaBell, FaUsers, FaBookmark } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";

export default function Footer() {
  const { token } = useContext(AuthContext);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/notifications/unread-count`,
          getHeaders()
        );
        return data.data?.unreadCount || data.count || data.unreadCount || 0;
      } catch (err) {
        return 0;
      }
    },
    enabled: !!token,
    refetchInterval: 30000 
  });

  if (!token) return null;

  const footerLinkStyle = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 transition-all duration-300 ${
      isActive
        ? "text-[#1f6fe5] scale-110"
        : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 z-50 w-full border-t border-slate-100 bg-white/90 backdrop-blur-xl px-4 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavLink to="/" className={footerLinkStyle}>
          <FaHome size={22} />
          <span className="text-[10px] font-bold">Feed</span>
        </NavLink>
        
        <NavLink to="/requests" className={footerLinkStyle}>
          <FaUsers size={22} />
          <span className="text-[10px] font-bold">Requests</span>
        </NavLink>

        <NavLink to="/bookmarks" className={footerLinkStyle}>
          <FaBookmark size={22} />
          <span className="text-[10px] font-bold">Saved</span>
        </NavLink>

        <NavLink to="/notifications" className={footerLinkStyle}>
          <div className="relative">
            <FaBell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Alerts</span>
        </NavLink>

        <NavLink to="/Profail" className={footerLinkStyle}>
          <FaUser size={22} />
          <span className="text-[10px] font-bold">Profile</span>
        </NavLink>
      </div>
    </footer>
  );
}
