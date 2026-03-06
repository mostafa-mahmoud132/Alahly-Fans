import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import logo from "../../assets/logo.png";
import { FaHome, FaUser, FaSignInAlt, FaUserPlus, FaBell, FaUsers, FaBookmark } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";

export default function Appnav() {
  const { token, setToken, userData } = useContext(AuthContext);
  const { name, email, photo } = userData || {};
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/notifications/unread-count`,
          getHeaders()
        );
        // The API returns { data: { unreadCount: 6 } }
        return data.data?.unreadCount || data.count || data.unreadCount || 0;
      } catch (err) {
        return 0;
      }
    },
    enabled: !!token,
    refetchInterval: 30000 
  });

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const navLinkStyle = ({ isActive }) =>
    `relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition-all duration-300 ${
      isActive
        ? "bg-white text-[#1f6fe5] shadow-sm transform scale-105"
        : "text-slate-500 hover:bg-white/90 hover:text-slate-900"
    }`;

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center gap-3 justify-between border-b border-slate-100 bg-white/80 px-4 py-2 backdrop-blur-xl">
      <NavLink to="/" className="flex items-center gap-2 group">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:rotate-12" />
        <span className="sm:block font-bold text-xl text-[#00298d] tracking-tight">
          Alahly Fans
        </span>
      </NavLink>
      
      <div className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-200/50 bg-slate-100/50 p-1">
          {token ? (
            <>
              <NavLink to="/" className={navLinkStyle}>
                <FaHome size={20} />
                <span className="hidden lg:block">Feed</span>
              </NavLink>
              <NavLink to="/Profail" className={navLinkStyle}>
                <FaUser size={20} />
                <span className="hidden lg:block">Profile</span>
              </NavLink>
              <NavLink to="/requests" className={navLinkStyle}>
                <FaUsers size={20} />
                <span className="hidden lg:block">Requests</span>
              </NavLink>
              <NavLink to="/bookmarks" className={navLinkStyle}>
                <FaBookmark size={20} />
                <span className="hidden lg:block">Bookmarks</span>
              </NavLink>
              <NavLink to="/notifications" className={navLinkStyle}>
                <FaBell size={20} />
                <span className="hidden lg:block">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 left-1 lg:right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkStyle}>
                <FaSignInAlt size={20} />
                <span className="hidden lg:block">Login</span>
              </NavLink>
              <NavLink to="/register" className={navLinkStyle}>
                <FaUserPlus size={20} />
                <span className="hidden lg:block">Register</span>
              </NavLink>
            </>
          )}
      </div>

      <div className="flex items-center min-w-[40px] justify-end">
        {token && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100 shadow-sm cursor-pointer">
                <img src={photo || 'https://via.placeholder.com/150'} alt="User" className="h-8 w-8 rounded-full border border-slate-200 object-cover" />
                <span className="hidden text-sm font-bold text-slate-700 sm:block">{name}</span>
              </div>
            }
          >
            <DropdownHeader className="px-4 py-3">
              <span className="block text-sm font-bold text-gray-900">{name}</span>
              <span className="block truncate text-sm font-medium text-gray-500">
                 {email}
              </span>
            </DropdownHeader>
            <DropdownItem onClick={() => navigate('/Profail')} className="font-semibold hover:bg-slate-50 transition-colors">
              👤 View Profile
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout} className="text-red-600 font-semibold hover:bg-red-50 transition-colors">
              Sign out
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
