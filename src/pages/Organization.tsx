import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OrgChart from "../components/OrgChart";
import { useState } from "react";
import ColleagueList from "../components/ColleagueList";

const Organization = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-slate-50">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 px-2">
              SƠ ĐỒ TỔ CHỨC
            </h2>
            {/* Hide on mobile (smaller than sm breakpoint) */}
            <div className="hidden sm:block bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <OrgChart />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
              <ColleagueList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Organization;
