import { useState } from "react";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm rounded flex items-center"
      >
        <span>Nguyễn Hoàng Phúc</span>
        <span className="text-xs md:text-sm">▼</span>

      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 md:w-40 bg-white shadow-md rounded-md text-sm">
          <a className="block px-2 py-1 md:px-4 md:py-2 hover:bg-gray-100 cursor-pointer">
            My profile
          </a>
          <a className="block px-2 py-1 md:px-4 md:py-2 hover:bg-gray-100 cursor-pointer">
            Themes
          </a>
          <a className="block px-2 py-1 md:px-4 md:py-2 hover:bg-gray-100 cursor-pointer">
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
