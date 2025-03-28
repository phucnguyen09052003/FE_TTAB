import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
      
      <button onClick={toggleSidebar} className="text-gray-700 lg:hidden">
        <FaBars size={24} />
      </button>

      <div className="flex-grow flex justify-center">
        <div className="flex items-center border rounded-md px-4 py-2 w-full max-w-2xl">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="px-4 py-2 outline-none w-full"
          />
        </div>
      </div>

   
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-500 cursor-pointer" />
        <DropdownMenu />
      </div>
    </div>
  );
};

export default Navbar;
