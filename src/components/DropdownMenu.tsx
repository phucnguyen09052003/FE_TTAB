import { useState } from "react";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
      >
        Nguyễn Hoàng Phúc ▼
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
          <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
            My profile
          </a>
          <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Themes
          </a>
          <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
