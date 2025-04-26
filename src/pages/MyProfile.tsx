import { useState, useEffect, Fragment } from "react";
import pdflogo from "/pdf-svgrepo-com.svg";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const years = [2025, 2024, 2023];
const salaryRecords: Record<number, Record<string, boolean>> = {
  2025: { "01": true, "02": true, "03": true, "04": false, "05": false, "06": false },
  2024: { "01": true, "02": false, "03": true, "04": false, "05": true, "06": false },
  2023: { "01": false, "02": false, "03": false, "04": true, "05": true, "06": true },
};

const MyProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isEditing, setIsEditing] = useState(false); // Add this line

  interface UserData {
    fullname: string;
    employeeId: string;
    hireDate: string;
    dob: string;
    maritalStatus: string;
    email: string;
    phone: string;
    permanentAddress: string;
    contactAddress: string;
    religion: string;
    ethnicity: string;
    nationality: string;
    education: string;
    idCard: string;
    issueDate: string;
    issuePlace: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    socialInsuranceNumber: string;
    position: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/usersdetail");
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu người dùng.");
        }
        const data = await response.json();

        setUserData(data[0]);
        console.log(userData?.position);
        console.log(userData?.ethnicity);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }

  if (!userData) {
    return <p>Không tìm thấy dữ liệu người dùng.</p>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-slate-50">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
          {/* Profile Header */}
          <div className="border-b border-indigo-100 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-900">THÔNG TIN NHÂN VIÊN</h2>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            {/* Profile Image Section */}
            <div className="w-full md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-lg shadow-lg overflow-hidden border-2 border-indigo-100">
                {/* Add image here if available */}
              </div>
              <p className="mt-4 text-lg font-semibold text-indigo-900">{userData?.fullname}</p>
            </div>

            {/* Profile Details Section */}
            <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {[
                ["Mã nhân viên", "Dân tộc"],
                ["Chức vụ", "Quốc tịch"],
                ["Ngày vào làm", "Trình độ văn hóa"],
                ["Ngày sinh nhân viên", "Số CMND/Hộ chiếu"],
                ["Tình trạng hôn nhân", "Ngày cấp"],
                ["Email", "Nơi cấp"],
                ["Điện thoại", "Tên ngân hàng"],
                ["Địa chỉ thường trú", "Tên tài khoản"],
                ["Địa chỉ liên hệ", "Số tài khoản"],
                ["Tôn giáo", "Số sổ BHXH"],
              ].map(([label1, label2], index) => (
                <Fragment key={index}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-indigo-900">{label1}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900"
                      value={getValue(label1, userData)}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-indigo-900">{label2}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900"
                      value={getValue(label2, userData)}
                      readOnly={!isEditing}
                    />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {!isEditing ? (
              <button 
                onClick={toggleEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-150 ease-in-out shadow-md"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition duration-150 ease-in-out"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    // Add your save logic here
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-150 ease-in-out shadow-md"
                >
                  Lưu thông tin
                </button>
              </>
            )}
          </div>

          {/* Salary Section */}
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-900 mb-6">PHIẾU LƯƠNG CÁ NHÂN</h2>

            {/* Year Selection */}
            <div className="flex gap-3 mb-8">
              {years.map((year) => (
                <button
                  key={year}
                  className={`px-4 py-2 rounded-md font-medium transition duration-150 ease-in-out ${
                    selectedYear === year
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Salary Records Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(salaryRecords[selectedYear]).map((month) => (
                <div key={month} className="flex flex-col items-center">
                  <div className="w-full max-w-xs border border-indigo-100 rounded-lg p-6 bg-gradient-to-br from-white to-indigo-50 shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                    {salaryRecords[selectedYear][month] ? (
                      <a href="#" className="flex items-center justify-center">
                        <img src={pdflogo} alt="PDF" className="w-16 h-16 transition-transform hover:scale-110 filter hover:drop-shadow-md" />
                      </a>
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-md mx-auto" />
                    )}
                    <p className="mt-4 text-center font-medium text-indigo-900 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-100">
                      {`${selectedYear}/${month}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to get values
const getValue = (label: string, userData: any) => {
  const mapping: { [key: string]: string } = {
    "Mã nhân viên": "employeeId",
    "Ngày vào làm": "hireDate",
    "Ngày sinh nhân viên": "dob",
    "Tình trạng hôn nhân": "maritalStatus",
    "Email": "email",
    "Điện thoại": "phone",
    "Địa chỉ thường trú": "permanentAddress",
    "Địa chỉ liên hệ": "contactAddress",
    "Tôn giáo": "religion",
    "Dân tộc": "ethnicity",
    "Quốc tịch": "nationality",
    "Trình độ văn hóa": "education",
    "Số CMND/Hộ chiếu": "idCard",
    "Ngày cấp": "issueDate",
    "Nơi cấp": "issuePlace",
    "Tên ngân hàng": "bankName",
    "Tên tài khoản": "accountName",
    "Số tài khoản": "accountNumber",
    "Số sổ BHXH": "socialInsuranceNumber",
    "Chức vụ": "position",
  };
  return userData?.[mapping[label]] || "";
};

export default MyProfile;