import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";
import { useEffect } from "react";
import { useAuthCheck } from "../utils/auth";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const checkAuth = useAuthCheck();

  useEffect(() => {
    // Check token expiration on component mount
    checkAuth();
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg">
      <button 
        onClick={toggleSidebar} 
        className="text-white lg:hidden hover:text-indigo-200 transition-colors"
      >
        <FaBars size={24} />
      </button>

      <div className="flex-grow flex justify-center ml-4">
        {/* <div className="flex items-center bg-indigo-700/50 border border-indigo-500 rounded-lg px-4 py-2 w-full max-w-2xl hover:bg-indigo-700/60 transition-colors">
          <FaSearch className="text-indigo-300" />
          <input
            type="text"
            placeholder="Tìm kiếm khuyến mãi..."
            className="px-4 py-1 bg-transparent outline-none w-full text-white placeholder-indigo-300 focus:placeholder-indigo-200"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-6 ml-4">
        {/* <div className="relative">
          <FaBell className="text-indigo-100 hover:text-white cursor-pointer transition-colors" size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div> */}
        <DropdownMenu />
      </div>
    </div>
  );
};

export default Navbar;
