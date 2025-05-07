import { useState, useEffect } from 'react';
import axios from 'axios';
import { EMPLOYEE_ENDPOINTS } from '../utils/apiEndpoints';
interface UserProfile {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  image: string;
  email: string;
  employeePhoneNumber: string;
  employeeLastLogin: string | null;
  employeeActive: number;
  companyCode: string;
  companyName: string;
}   

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      let employeeCode = "";
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        employeeCode = tokenPayload.employeeCode;
      } catch (err) {
        console.error("Failed to extract employee code from token", err);
        setError("Không tìm thấy mã nhân viên trong token");
        setLoading(false);
        return;
      }

      const response = await axios.get(EMPLOYEE_ENDPOINTS.BY_CODE(employeeCode), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.status === 200) {
        setProfile(response.data.data);
      } else {
        setError('Không thể tải thông tin người dùng');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Đã xảy ra lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSuccessMessage(null);
  
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }
  
    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setPasswordError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
  
      // Extract employee code from token
      let employeeCode = "";
      try {
        // Giải mã token để lấy mã nhân viên
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        employeeCode = tokenPayload.employeeCode;
      } catch (err) {
        console.error("Failed to extract employee code from token", err);
        setPasswordError("Không tìm thấy mã nhân viên trong token");
        return;
      }
  
      // Gửi yêu cầu đổi mật khẩu
      const response = await axios.put(
        EMPLOYEE_ENDPOINTS.CHANGE_PASSWORD(employeeCode),
        {
          oldPassword: currentPassword, // Đổi tên trường cho đúng với API
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Xử lý kết quả thành công
      if (response.data?.status === 200) {
        setSuccessMessage(response.data?.message || 'Đổi mật khẩu thành công');
        // Reset form sau khi thành công
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Ẩn form sau 2 giây
        setTimeout(() => {
          setShowPasswordForm(false);
        }, 2000);
      } else {
        setPasswordError(response.data?.message || 'Đổi mật khẩu không thành công');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      // Handle the error response format from the API
      if (err.response?.data) {
        setPasswordError(err.response.data.message || 'Đã xảy ra lỗi khi đổi mật khẩu');
      } else {
        setPasswordError('Không thể kết nối đến máy chủ');
      }
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-red-500 flex justify-center items-center h-64">{error}</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-64">Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-8">Thông tin cá nhân</h1> */}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{profile.employeeName}</h2>
                <p className="text-gray-500 text-sm">Mã nhân viên: {profile.employeeCode}</p>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900 font-medium">{profile.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="mt-1 text-gray-900 font-medium">{profile.employeePhoneNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Công ty</label>
                  <p className="mt-1 text-gray-900 font-medium">Công ty: {profile.companyName} ({profile.companyCode})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${profile.employeeActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {profile.employeeActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </p>
                </div>
                
                {profile.employeeLastLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Đăng nhập gần nhất</label>
                    <p className="mt-1 text-gray-900 font-medium">{new Date(profile.employeeLastLogin).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Password change form */}
        {showPasswordForm && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                {successMessage}
              </div>
            )}
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {passwordError}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 