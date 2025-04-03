import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import OrgChart from "./OrgChart";
import { useState } from "react";
import ColleagueList from "./ColleagueList";

const Organization = () => {const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      
<div className="flex-1 flex flex-col bg-gray-50 w-[1280px]">
 
  <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-6 space-y-6">
          <OrgChart />
          <ColleagueList />
        </main>
      </div>
    </div>
  );
};

export default Organization;
