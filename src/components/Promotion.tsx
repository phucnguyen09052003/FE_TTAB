import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const promotions = [
  { 
    code: "LDL-CONVENTION-WEDDING-AFF", 
    name: "Ưu đãi cho khách được nhân viên HST giới thiệu (Affiliate)",
    company: "CÔNG TY CỔ PHẦN NHÀ HÀNG - KHÁCH SẠN LÊ THÀNH",
    brand: "CÔNG TY TNHH AB BEAUTY WORLD",
    expiry: "2024-06-20"
  },
  
];

const Promotion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
     
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      
      <div className="flex-1 flex flex-col bg-gray-50">
       
        <Navbar toggleSidebar={toggleSidebar} />

      
        <main className="p-6 text-sm md:text-base lg:text-lg overflow-x-hidden">
          <h2 className="text-xl font-bold">Khuyến mãi</h2>
          <hr className="mt-4 mb-6 border-gray-500" />

          
          <div className="overflow-x-auto">
            <table className="table-fixed w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 ">Mã</th>
                  <th className="border border-gray-300 px-4 py-2">Tên</th>
                  <th className="border border-gray-300 px-4 py-2">Tên công ty phát hành</th>
                  <th className="border border-gray-300 px-4 py-2 ">Thương hiệu phát hành</th>
                  <th className="border border-gray-300 px-4 py-2 ">Ngày hết hạn</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{promo.code}</td>
                    <td className="border border-gray-300 px-4 py-2">{promo.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{promo.company}</td>
                    <td className="border border-gray-300 px-4 py-2">{promo.brand}</td>
                    <td className="border border-gray-300 px-4 py-2">{promo.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        
          <div className="flex justify-center mt-6 space-x-2">
            <button className="px-3 py-1 border border-gray-400 rounded-md">«</button>
            <button className="px-3 py-1 border border-gray-400 bg-blue-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-gray-400 rounded-md">2</button>
            <button className="px-3 py-1 border border-gray-400 rounded-md">3</button>
            <button className="px-3 py-1 border border-gray-400 rounded-md">»</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Promotion;
