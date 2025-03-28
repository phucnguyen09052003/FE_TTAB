import { useState ,Fragment} from "react";


import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const EmployeeInfo = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar toggleSidebar={toggleSidebar} />

        
        <main className="p-6">
          <h2 className="text-xl font-bold">THÔNG TIN NHÂN VIÊN</h2>

          <hr className="mt-4 mb-6 border-gray-500" />

          <div className="flex gap-8">
            {/* Ảnh đại diện */}
            <div className="w-full flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-300 rounded-md"></div>
              <p className="mt-4 font-bold">Nguyễn Hoàng Phúc</p>
            </div>

            {/* Form nhập liệu */}
            <div className="w-full grid grid-cols-2 gap-8">
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
                  <div>
                    <label className="block font-semibold">{label1}</label>
                    <input type="text" className="w-[200] border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-semibold">{label2}</label>
                    <input type="text" className="w-[200] border p-2 rounded-md" />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Nút chức năng */}
          <div className="mt-6 flex justify-end gap-4">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md">Hủy</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Lưu thông tin</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeInfo;
