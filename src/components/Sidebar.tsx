import { FaHome, FaUser, FaGift, FaProjectDiagram, FaCog, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import React Router

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate(); // Hook điều hướng

  return (
    <div className={`fixed lg:static top-0 left-0 h-full bg-blue-100 shadow-md transition-all duration-300 ${isOpen ? "w-64" : "w-0 lg:w-64"} overflow-hidden`}>
      <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-700 lg:hidden">
        <FaTimes size={20} />
      </button>

      <ul className="mt-12 space-y-4 px-6">
        <li className="flex items-center gap-2 text-gray-700 hover:bg-blue-200 p-2 rounded-md cursor-pointer" onClick={() => navigate("/")}>
          <FaHome /> Trang chủ
        </li>
        <li className="flex items-center gap-2 text-gray-700 hover:bg-blue-200 p-2 rounded-md cursor-pointer" onClick={() => navigate("/myprofile")}>
          <FaUser /> Thông tin cá nhân
        </li>
        <li className="flex items-center gap-2 text-gray-700 hover:bg-blue-200 p-2 rounded-md cursor-pointer" onClick={() => navigate("/promotion")}>
          <FaGift /> Khuyến mãi
        </li>
        <li className="flex items-center gap-2 text-gray-700 hover:bg-blue-200 p-2 rounded-md cursor-pointer" onClick={() => navigate("/organization")}>
          <FaProjectDiagram /> Sơ đồ tổ chức
        </li>
        <li className="flex items-center gap-2 text-gray-700 hover:bg-blue-200 p-2 rounded-md">
          <FaCog /> Cài đặt
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
