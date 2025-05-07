import { useState, useEffect, Fragment } from "react";
import pdflogo from "/pdf-svgrepo-com.svg";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { jwtDecode } from 'jwt-decode';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { INFO_EMPLOYEE_ENDPOINTS, SALARY_ENDPOINTS } from "../utils/apiEndpoints";
import { API_BASE_URL } from "../utils/env.config";


// Constants for select fields
const MARITAL_STATUS_OPTIONS = [
  { value: "Married", label: "Đã kết hôn" },
  { value: "Single", label: "Chưa kết hôn" },
];

const EDUCATION_LEVELS = [
  { value: "Primary School", label: "Tiểu học" },
  { value: "Secondary School", label: "Trung học cơ sở" },
  { value: "High School", label: "Trung học phổ thông" },
  { value: "College", label: "Cao đẳng" },
  { value: "University", label: "Đại học" },
  { value: "Master", label: "Thạc sĩ" },
  { value: "PhD", label: "Tiến sĩ" },
];

const NATIONALITY_OPTIONS = [
  { value: "Vietnam", label: "Việt Nam" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "United States", label: "Hoa Kỳ" },
  { value: "China", label: "Trung Quốc" },
  { value: "Japan", label: "Nhật Bản" },
  { value: "Korea", label: "Hàn Quốc" },
  // Add more countries as needed
];

// Generate years from 2015 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2015 + 1 }, (_, index) => currentYear - index);

// Interface for salary data
interface SalaryRecord {
  id: number;
  employeeCode: string;
  employeeName: string;
  salaryDate: string;
  salaryBasic: number;
  salaryBonus: number;
  salaryDeductions: number;
  salaryTotalSalary: number;
  salaryPaymentStatus: string;
  salaryLinkFile: string;
}

// Pagination interface
interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Legacy data structure - will be replaced with API dat

interface UserData {
  fullname: string;
  employeeId: string;
  employeeCode: string;
  hireDate: string;
  image: string;
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
// Notification type and components
type NotificationType = 'success' | 'error' | null;

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  if (!type) return null;

  const bgColor = type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 border-l-4 ${bgColor} rounded-md shadow-md`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        <button onClick={onClose} className={`ml-4 ${textColor}`}>
          <span className="sr-only">Close</span>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ type: NotificationType; message: string }>({
    type: null,
    message: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Salary data states
  const [salaryData, setSalaryData] = useState<SalaryRecord[]>([]);
  const [loadingSalary, setLoadingSalary] = useState(false);
  const [salaryError, setSalaryError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6); // Show 6 items per page as requested
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset image preview when canceling edit
    if (!isEditing) {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!userData) return;

    const mapping: { [key: string]: keyof UserData } = {
      "Mã nhân viên": "employeeCode",
      "Chức vụ": "position",
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
    };

    const dataField = mapping[field];
    if (dataField) {
      setUserData({
        ...userData,
        [dataField]: value
      });
    }
  };

  // Handler for date picker changes
  const handleDateChange = (field: string, date: Date | null) => {
    if (!userData || !date) return;

    const mapping: { [key: string]: keyof UserData } = {
      "Ngày vào làm": "hireDate",
      "Ngày sinh nhân viên": "dob",
      "Ngày cấp": "issueDate",
    };

    const dataField = mapping[field];
    if (dataField) {
      if (dataField === 'dob') {
        // For DOB, use ISO format
        setUserData({
          ...userData,
          [dataField]: date.toISOString()
        });
      } else {
        // For other dates, use YYYY-MM-DD format
        const formattedDate = date.toISOString().split('T')[0];
        setUserData({
          ...userData,
          [dataField]: formattedDate
        });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserData = async () => {
    if (!userData) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập.");
      }

      const employeeCode = userData.employeeCode;

      // Create a copy of userData for sending to API
      const userDataForApi = { ...userData };

      // Create FormData for file upload
      const formData = new FormData();

      // Add the employee data as a JSON string
      formData.append("employeeData", JSON.stringify(userDataForApi));

      // Add the image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(INFO_EMPLOYEE_ENDPOINTS.INFO_EMPLOYEE(employeeCode), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật thông tin người dùng.");
      }

      const result = await response.json();

      // Update the user data with the new data returned from the server
      if (result.data) {
        setUserData(result.data);
      } else {
        // If the API doesn't return updated data, fetch it again
        await fetchUserData();
      }

      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      setNotification({
        type: 'success',
        message: 'Thông tin người dùng đã được cập nhật thành công.'
      });
    } catch (err) {
      setError((err as Error).message);
      setNotification({
        type: 'error',
        message: 'Có lỗi xảy ra khi cập nhật thông tin người dùng.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    let employeeCode = "";
    if (token) {
      const decodedToken: any = jwtDecode(token);
      employeeCode = decodedToken.employeeCode;
    }

    try {
      const response = await fetch(INFO_EMPLOYEE_ENDPOINTS.INFO_EMPLOYEE(employeeCode), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu người dùng.");
      }

      const data = await response.json();

      // Set user data
      setUserData(data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch salary data from API
  const fetchSalaryData = async (page: number = 0) => {
    if (!userData?.employeeCode) return;

    setLoadingSalary(true);
    setSalaryError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập.");
      }

      const response = await fetch(
        SALARY_ENDPOINTS.SALARY(userData.employeeCode, selectedYear.toString()),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 404) {
        throw new Error("Không tìm thấy Bảng lương");
      } else if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu lương.");
      }

      const data = await response.json();
      setSalaryData(data.data.content || []);

      // Set pagination info
      setPaginationInfo({
        pageNumber: data.data.pageable.pageNumber,
        pageSize: data.data.pageable.pageSize,
        totalElements: data.data.totalElements,
        totalPages: data.data.totalPages,
        last: data.data.last,
        first: data.data.first
      });

      // Update current page
      setCurrentPage(data.data.pageable.pageNumber);

    } catch (err) {
      setSalaryError((err as Error).message);
      console.error("Lỗi khi tải dữ liệu lương:", err);
    } finally {
      setLoadingSalary(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchSalaryData(newPage);
  };

  // Fetch salary data when year changes
  useEffect(() => {
    if (userData?.employeeCode) {
      setCurrentPage(0); // Reset to first page when year changes
      fetchSalaryData(0);
    }
  }, [selectedYear, userData?.employeeCode]);

  useEffect(() => {
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
          <div className="border-b border-indigo-100 pb-4 mb-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-900">THÔNG TIN NHÂN VIÊN</h2>
            <div className="text-sm text-indigo-600">
              <span className="mr-2">Mã nhân viên:</span>
              <span className="font-semibold">{userData?.employeeCode}</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            {/* Profile Image Section */}
            <div className="w-full md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-lg shadow-lg overflow-hidden border-2 border-indigo-100 relative group">
                <img src={imagePreview || userData?.image} alt="Avatar" className="w-full h-full object-cover" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <label className="bg-white text-indigo-600 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-50 transition-colors duration-200">
                      <span>Thay đổi</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="mt-4 text-lg font-semibold text-indigo-900">{userData?.fullname}</p>
              <p className="text-sm text-indigo-600">{userData?.position}</p>

              <div className="mt-6 w-full bg-white rounded-lg shadow-sm border border-indigo-50 p-4">
                <h3 className="text-md font-semibold text-indigo-900 mb-3 border-b border-indigo-50 pb-2">Thông tin liên hệ</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData?.email}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {userData?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="w-full md:w-3/4">
              <div className="bg-white rounded-lg shadow-sm border border-indigo-50 p-6 mb-8">
                <h3 className="text-lg font-semibold text-indigo-900 mb-5 pb-2 border-b border-indigo-50">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Employee Code */}
                  <CustomTextInput
                    label="Mã nhân viên"
                    value={userData?.employeeCode || ""}
                    disabled={true}
                  />

                  {/* Ethnicity */}
                  <CustomTextInput
                    label="Dân tộc"
                    value={userData?.ethnicity || ""}
                    onChange={(e) => handleInputChange("Dân tộc", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Position */}
                  <CustomTextInput
                    label="Chức vụ"
                    value={userData?.position || ""}
                    disabled={true}
                  />

                  {/* Nationality - Dropdown */}
                  <CustomSelectInput
                    label="Quốc tịch"
                    value={userData?.nationality || ""}
                    options={NATIONALITY_OPTIONS}
                    onChange={(value) => handleInputChange("Quốc tịch", value)}
                    disabled={!isEditing}
                  />

                  {/* Hire Date - DatePicker */}
                  <CustomDateInput
                    label="Ngày vào làm"
                    value={userData?.hireDate || ""}
                    onChange={(date) => handleDateChange("Ngày vào làm", date)}
                    disabled={!isEditing}
                  />

                  {/* Education - Dropdown */}
                  <CustomSelectInput
                    label="Trình độ văn hóa"
                    value={userData?.education || ""}
                    options={EDUCATION_LEVELS}
                    onChange={(value) => handleInputChange("Trình độ văn hóa", value)}
                    disabled={!isEditing}
                  />

                  {/* Date of Birth - DatePicker */}
                  <CustomDateInput
                    label="Ngày sinh nhân viên"
                    value={userData?.dob || ""}
                    onChange={(date) => handleDateChange("Ngày sinh nhân viên", date)}
                    disabled={!isEditing}
                  />

                  {/* ID Card */}
                  <CustomTextInput
                    label="Số CMND/Hộ chiếu"
                    value={userData?.idCard || ""}
                    onChange={(e) => handleInputChange("Số CMND/Hộ chiếu", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Marital Status - Dropdown */}
                  <CustomSelectInput
                    label="Tình trạng hôn nhân"
                    value={userData?.maritalStatus || ""}
                    options={MARITAL_STATUS_OPTIONS}
                    onChange={(value) => handleInputChange("Tình trạng hôn nhân", value)}
                    disabled={!isEditing}
                  />

                  {/* Issue Date - DatePicker */}
                  <CustomDateInput
                    label="Ngày cấp"
                    value={userData?.issueDate || ""}
                    onChange={(date) => handleDateChange("Ngày cấp", date)}
                    disabled={!isEditing}
                  />

                  {/* Email */}
                  <CustomTextInput
                    label="Email"
                    value={userData?.email || ""}
                    onChange={(e) => handleInputChange("Email", e.target.value)}
                    disabled={true}
                    type="email"
                  />

                  {/* Issue Place */}
                  <CustomTextInput
                    label="Nơi cấp"
                    value={userData?.issuePlace || ""}
                    onChange={(e) => handleInputChange("Nơi cấp", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Phone */}
                  <CustomTextInput
                    label="Điện thoại"
                    value={userData?.phone || ""}
                    onChange={(e) => handleInputChange("Điện thoại", e.target.value)}
                    disabled={!isEditing}
                    type="tel"
                  />

                  {/* Bank Name */}
                  <CustomTextInput
                    label="Tên ngân hàng"
                    value={userData?.bankName || ""}
                    onChange={(e) => handleInputChange("Tên ngân hàng", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Permanent Address */}
                  <CustomTextInput
                    label="Địa chỉ thường trú"
                    value={userData?.permanentAddress || ""}
                    onChange={(e) => handleInputChange("Địa chỉ thường trú", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Account Name */}
                  <CustomTextInput
                    label="Tên tài khoản"
                    value={userData?.accountName || ""}
                    onChange={(e) => handleInputChange("Tên tài khoản", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Contact Address */}
                  <CustomTextInput
                    label="Địa chỉ liên hệ"
                    value={userData?.contactAddress || ""}
                    onChange={(e) => handleInputChange("Địa chỉ liên hệ", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Account Number */}
                  <CustomTextInput
                    label="Số tài khoản"
                    value={userData?.accountNumber || ""}
                    onChange={(e) => handleInputChange("Số tài khoản", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Religion */}
                  <CustomTextInput
                    label="Tôn giáo"
                    value={userData?.religion || ""}
                    onChange={(e) => handleInputChange("Tôn giáo", e.target.value)}
                    disabled={!isEditing}
                  />

                  {/* Social Insurance Number */}
                  <CustomTextInput
                    label="Số sổ BHXH"
                    value={userData?.socialInsuranceNumber || ""}
                    onChange={(e) => handleInputChange("Số sổ BHXH", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={fetchUserData}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150 ease-in-out shadow-md flex items-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Làm mới
                          </>
                        )}
                      </button>
                      <button
                        onClick={toggleEdit}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-150 ease-in-out shadow-md flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition duration-150 ease-in-out flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy
                      </button>
                      <button
                        onClick={saveUserData}
                        disabled={isSaving}
                        className={`px-4 py-2 ${isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md transition duration-150 ease-in-out shadow-md flex items-center`}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Lưu thông tin
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Salary Section */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-indigo-50 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-900 mb-6 pb-2 border-b border-indigo-50">PHIẾU LƯƠNG CÁ NHÂN</h2>

            {/* Year Selection */}
            <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto pb-2">
              {years.map((year) => (
                <button
                  key={year}
                  className={`px-4 py-2 rounded-md font-medium transition duration-150 ease-in-out ${selectedYear === year
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loadingSalary && (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="inline-flex flex-col items-center px-6 py-6 bg-indigo-100 border border-indigo-200 rounded-lg">
                  <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-indigo-700 font-medium text-lg">Đang tải dữ liệu lương...</span>
                  <p className="text-indigo-600 mt-2 text-center">Vui lòng đợi trong giây lát</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {salaryError && !loadingSalary && (
              <div className="min-h-[400px] flex flex-col items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-400 p-6 my-6 max-w-2xl mx-auto rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Không thể tải dữ liệu lương</h3>
                      <p className="mt-2 text-base text-red-700">
                        {salaryError || "Không thể tải dữ liệu lương. Vui lòng thử lại sau."}
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => fetchSalaryData(0)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loadingSalary && !salaryError && salaryData.length === 0 && (
              <div className="text-center py-20 px-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Không có dữ liệu lương</h3>
                <p className="mt-2 text-base text-gray-500">
                  Chưa có dữ liệu lương cho năm {selectedYear}.
                </p>
                <button
                  onClick={() => fetchSalaryData(0)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Thử lại
                </button>
              </div>
            )}

            {/* Salary Records Grid */}
            {!loadingSalary && !salaryError && salaryData.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salaryData.map((record) => {
                    // Extract month from salaryDate (format: "2023-01-01")
                    const date = new Date(record.salaryDate);
                    const month = String(date.getMonth() + 1).padStart(2, '0');

                    return (
                      <div key={record.id} className="flex flex-col items-center">
                        <div className="w-full max-w-xs border border-indigo-100 rounded-lg p-6 bg-gradient-to-br from-white to-indigo-50 shadow-sm hover:shadow-md transition duration-150 ease-in-out group">
                          {record.salaryPaymentStatus === "Paid" ? (
                            <a href={record.salaryLinkFile} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-all duration-200">
                                <img src={pdflogo} alt="PDF" className="w-10 h-10 transition-transform group-hover:scale-110 filter group-hover:drop-shadow-md" />
                              </div>
                              <div className="w-full">
                                <p className="text-center font-medium text-indigo-900 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-100 w-full mb-2">
                                  Tháng {month}/{selectedYear}
                                </p>
                                <p className="text-center text-sm text-indigo-700">
                                  <span className="font-semibold">Tổng lương: </span>
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.salaryTotalSalary)}
                                </p>
                              </div>
                            </a>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <div className="w-full">
                                <p className="text-center font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 w-full mb-2">
                                  Tháng {month}/{selectedYear}
                                </p>
                                <p className="text-center text-sm text-gray-500">
                                  <span className="font-semibold">Tổng lương: </span>
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.salaryTotalSalary)}
                                </p>
                                <p className="text-center text-xs text-yellow-600 mt-1">
                                  Chưa thanh toán
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination controls */}
                {paginationInfo && paginationInfo.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={paginationInfo.first}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${paginationInfo.first
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Trang trước</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {Array.from({ length: paginationInfo.totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={paginationInfo.last}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${paginationInfo.last
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Trang sau</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}

                {/* Pagination summary */}
                {paginationInfo && (
                  <div className="mt-3 text-sm text-center text-gray-600">
                    Hiển thị {salaryData.length} trong tổng số {paginationInfo.totalElements} bảng lương
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      {notification.type && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: '' })}
        />
      )}
    </div>
  );
};

const isDateField = (label: string): boolean => {
  return label === "Ngày vào làm" || label === "Ngày sinh nhân viên" || label === "Ngày cấp";
};

// Format date from API format (various formats) to HTML input format (yyyy-mm-dd)
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";

  // Check if the date is already in yyyy-mm-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Handle ISO date format (e.g., 2025-01-11T17:00:00.000+00:00)
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }

  // Handle format like "2020-08-13 00:00:00"
  if (dateString.includes(' ') && dateString.includes(':')) {
    return dateString.split(' ')[0];
  }

  // Parse dd/mm/yyyy to yyyy-mm-dd
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return dateString;
};

// Format date from HTML input format (yyyy-mm-dd) to API format (dd/mm/yyyy)
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";

  // Parse yyyy-mm-dd to dd/mm/yyyy
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return dateString;
};

// Get value for input fields, handling date formats
const getInputValue = (label: string, userData: any): string => {
  if (!userData) return "";

  const mapping: { [key: string]: keyof UserData } = {
    "Mã nhân viên": "employeeCode",
    "Chức vụ": "position",
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
  };

  const field = mapping[label];
  if (!field) return "";

  const value = userData[field];

  // Format dates for input fields
  if (isDateField(label)) {
    return formatDateForInput(value);
  }

  return value || "";
};

// Custom date picker component
const CustomDateInput = ({ label, value, onChange, disabled }: {
  label: string;
  value: string;
  onChange: (date: Date | null) => void;
  disabled: boolean;
}) => {
  // Parse the date string to a Date object
  const dateValue = value ? new Date(value) : null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-900">{label}</label>
      <div className="relative">
        <DatePicker
          selected={dateValue}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className={`w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm 
            ${disabled ? "bg-gray-50 cursor-not-allowed" :
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"} 
            text-indigo-900`}
          disabled={disabled}
          placeholderText="DD/MM/YYYY"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          yearDropdownItemNumber={15}
          popperPlacement="bottom-start"
          customInput={
            <div className="flex items-center">
              <input
                type="text"
                className={`w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm 
                  ${disabled ? "bg-gray-50 cursor-not-allowed" :
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"} 
                  text-indigo-900 pr-10`}
                placeholder="DD/MM/YYYY"
                readOnly
                value={dateValue ? dateValue.toLocaleDateString('vi-VN') : ''}
                disabled={disabled}
              />
              {!disabled && (
                <svg
                  className="w-5 h-5 text-indigo-500 absolute right-3 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

// Custom select input component
const CustomSelectInput = ({ label, value, options, onChange, disabled }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled: boolean;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-900">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm 
            appearance-none
            ${disabled ? "bg-gray-50 cursor-not-allowed" :
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"} 
            text-indigo-900 pr-10`}
        >
          <option value="">-- Chọn --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {!disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom text input component
const CustomTextInput = ({ label, value, onChange, disabled, type = "text" }: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  type?: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-900">{label}</label>
      <div className="relative">
        <input
          type={type}
          className={`w-full px-3 py-2 bg-white border border-indigo-200 rounded-md shadow-sm 
            ${disabled ? "bg-gray-50 cursor-not-allowed" :
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"} 
            text-indigo-900`}
          value={value}
          onChange={onChange}
          readOnly={disabled}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default MyProfile;