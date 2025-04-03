import { useState ,Fragment} from "react";

import pdflogo from '/pdf-svgrepo-com.svg'

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const years = [2025, 2024, 2023];
const salaryRecords: Record<number, Record<string, boolean>> = {
  2025: { "01": true, "02": true, "03": true, "04": false, "05": false, "06": false },
  2024: { "01": true, "02": false, "03": true, "04": false, "05": true, "06": false },
  2023: { "01": false, "02": false, "03": false, "04": true, "05": true, "06": true }
};

const MyProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
     
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
     
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar toggleSidebar={toggleSidebar} />
      
        
        <main className="p-6 text-sm md:text-base lg:text-lg overflow-x-hidden">

        <hr className="mt-10 mb-6 border-gray-500" />
          <h2 className="text-xl font-bold">THÔNG TIN NHÂN VIÊN</h2>

         

          <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mt-6">
  

            <div className="w-full flex flex-col items-center">
                        <div className="w-40 h-40 bg-gray-300 rounded-md"></div>
                        <p className="mt-4 font-bold">Nguyễn Hoàng Phúc</p>
                      </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {[
                ["Mã nhân viên", "Quốc tịch"],
                ["Ngày vào làm", "Trình độ văn hóa"],
                ["Ngày sinh nhân viên", "Số CMND/Hộ chiếu"],
                ["Tình trạng hôn nhân", "Ngày cấp"],
                ["Email", "Nơi cấp"],
                ["Điện thoại", "Tên ngân hàng"],
                ["Địa chỉ thường trú", "Tên tài khoản"],
                ["Địa chỉ liên hệ", "Số tài khoản"],
                ["Tôn giáo", "Số sổ BHXH"],
                ["Dân tộc", "Chức vụ"],
              ].map(([label1, label2], index) => (
                <Fragment key={index}>
                  <div className="grid gap-4 mb-6">
                    <label className="block font-semibold">{label1}</label>
                    <input type="text" className="w-full max-w-md border p-2 rounded-md" />
                  </div>

                  <div className="grid gap-4 mb-6">
                    <label className="block font-semibold">{label2}</label>
                    <input type="text" className="w-full max-w-md border p-2 rounded-md" />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>


         
          <div className="mt-6 flex justify-end gap-4">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md">Hủy</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Lưu thông tin</button>
          </div>
          <h2 className="text-xl font-bold mt-10">PHIẾU LƯƠNG CÁ NHÂN</h2>
          <hr className="mt-10 mb-6 border-gray-500" />

          
          <div className="flex gap-4 mb-6">
            {years.map((year) => (
              <button
                key={year}
                className={`px-4 py-2 rounded-md font-bold ${
                  selectedYear === year ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

         
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
  {Object.keys(salaryRecords[selectedYear]).map((month) => (
    <div key={month} className="flex flex-col items-center">
     
      <div className="border rounded-md p-4 w-80 h-40 flex items-center justify-center">
        {salaryRecords[selectedYear][month] ? (
          <a href="#">
          <img src={pdflogo} alt="PDF" className="w-120 h-20" />
          </a>

        ) : (
          <div className="w-16 h-16 bg-gray-200"></div>
        )}
      </div>

   
      <p className="mt-2 px-2 py-1 bg-gray-300 rounded-md">{selectedYear}/{month}</p>
    </div>
  ))}
</div>

        </main>
      </div>
    </div>
  );
};

export default MyProfile;
