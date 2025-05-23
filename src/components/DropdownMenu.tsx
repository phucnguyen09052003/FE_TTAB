import { useState, useEffect } from "react";
import { FaUser, FaKey, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("fullname");
  
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fullname"); 
    window.location.href = "/login"; 
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg flex items-center gap-3 transition-all duration-200"
      >
        <span className="font-medium">{fullName}</span>
        <FaChevronDown
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          size={14}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden transform origin-top-right transition-all duration-200 z-50">
          <div className="py-1">
            {/* <a className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
              <FaUser className="text-slate-400 mr-3" size={16} />
              <span>Thông tin cá nhân</span>
            </a> */}
            <a href="/profile" className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
              <FaKey className="text-slate-400 mr-3" size={16} />
              <span>Đổi mật khẩu</span>
            </a>
            <hr className="my-1 border-slate-200" />
            <a
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <FaSignOutAlt className="mr-3" size={16} />
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
