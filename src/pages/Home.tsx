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
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col bg-slate-50">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
              THÔNG TIN CHÍNH SÁCH QUY ĐỊNH
            </h2>

            {/* System Guide Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold text-slate-700">
                  Hướng dẫn sử dụng hệ thống
                </h3>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                  Tất cả
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card title="Đăng ký vắng mặt" />
                <Card title="Đăng ký ngoài giờ" />
                <Card title="Đăng ký đổi ca" />
                <Card title="Đăng ký bổ sung giờ vào ra" />
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Employee Handbook Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold text-slate-700">
                  Sổ tay nhân viên
                </h3>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                  Tất cả
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card title="Nội quy lao động" />
                <Card title="Chính sách công tác trong nước" />
                <Card title="Chính sách tuyển dụng người thân" />
                <Card title="Chính sách cấp phát thiết bị" />
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Insurance Handbook Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold text-slate-700">
                  Sổ tay bảo hiểm
                </h3>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                  Tất cả
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card title="Sổ tay bảo hiểm" />
                <Card title="Quy định bồi thường" />
                <Card title="Quy định bảo lãnh" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
