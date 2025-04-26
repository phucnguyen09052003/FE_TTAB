import { FaHome, FaUser, FaGift, FaProjectDiagram, FaCog, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className={`fixed lg:static top-0 left-0 h-full bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl transition-all duration-300 z-50 ${
      isOpen ? "w-64" : "w-0 lg:w-64"
    } overflow-hidden`}>
      <button 
        onClick={toggleSidebar} 
        className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden transition-colors"
      >
        <FaTimes size={20} />
      </button>

      <div className="mt-12 space-y-1 px-3">
        {[
          { path: "/", icon: <FaHome size={18} />, label: "Trang chủ" },
          { path: "/myprofile", icon: <FaUser size={18} />, label: "Thông tin cá nhân" },
          { path: "/promotion", icon: <FaGift size={18} />, label: "Khuyến mãi" },
          { path: "/organization", icon: <FaProjectDiagram size={18} />, label: "Sơ đồ tổ chức" },
          { path: "/settings", icon: <FaCog size={18} />, label: "Cài đặt" }
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActiveRoute(item.path)
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            <span className={`${isActiveRoute(item.path) ? "text-white" : "text-slate-400"}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
