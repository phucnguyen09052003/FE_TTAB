import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
     
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar toggleSidebar={toggleSidebar} />

       
        <main className="p-6">
        
          <h2 className="text-xl font-bold">THÔNG TIN CHÍNH SÁCH QUY ĐỊNH</h2>

          
          <hr className="mt-8 mb-4 border-gray-500" />

       
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Hướng dẫn sử dụng hệ thống</h3>
              <a href="#" className="text-blue-500 text-sm">Tất cả</a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card title="Đăng ký vắng mặt" />
              <Card title="Đăng ký ngoài giờ" />
              <Card title="Đăng ký đổi ca" />
              <Card title="Đăng ký bổ sung giờ vào ra" />
            </div>
          </div>

        
          <hr className="mt-10 mb-4 border-gray-500" />

         
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Sổ tay nhân viên</h3>
              <a href="#" className="text-blue-500 text-sm">Tất cả</a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card title="Nội quy lao động" />
              <Card title="Chính sách công tác trong nước" />
              <Card title="Chính sách tuyển dụng người thân" />
              <Card title="Chính sách cấp phát thiết bị" />
            </div>
          </div>

         
          <hr className="mt-10 mb-4 border-gray-500" />

        
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Sổ tay bảo hiểm</h3>
              <a href="#" className="text-blue-500 text-sm">Tất cả</a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card title="Sổ tay bảo hiểm" />
              <Card title="Quy định bồi thường" />
              <Card title="Quy định bảo lãnh" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
