import { useState, useEffect } from 'react';
import axios from 'axios';

interface Colleague {
  employeeName: string;
  email: string;
  employeePhoneNumber: string;
}

const ColleagueModal = ({ 
  colleague, 
  isOpen, 
  onClose 
}: { 
  colleague: Colleague | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !colleague) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Thông tin chi tiết
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt={`${colleague.employeeName}'s avatar`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                <p className="mt-1 text-gray-900">{colleague.employeeName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-blue-600">{colleague.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <p className="mt-1 text-gray-900">{colleague.employeePhoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const ColleagueList = () => {
    const [colleagues, setColleagues] = useState<Colleague[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const itemsPerPageOptions = [5, 10, 15, 20];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(null);

    useEffect(() => {
        const fetchColleagues = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:8080/api/employee/same-company', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setColleagues(response.data.data.content);
            } catch (err) {
                console.error('Error fetching colleagues:', err);
                setError(axios.isAxiosError(err) 
                    ? err.response?.data?.message || 'Không thể tải danh sách đồng nghiệp'
                    : 'Đã xảy ra lỗi khi tải dữ liệu'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchColleagues();
    }, []);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = colleagues.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(colleagues.length / itemsPerPage);

    if (loading) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="w-full overflow-hidden">
            {/* Add title */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                THÔNG TIN ĐỒNG NGHIỆP
            </h2>

            {/* Items per page selector */}
            <div className="flex items-center justify-end mb-4 space-x-4">
                <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-600">Hiển thị:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                        {itemsPerPageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">mục mỗi trang</span>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <tr>
                            <th scope="col" className="p-4 w-[60px]">STT</th>
                            <th scope="col" className="p-4 w-[80px]">Hình ảnh</th>
                            <th scope="col" className="p-4">Họ tên</th>
                            <th scope="col" className="p-4 hidden sm:table-cell">Email</th>
                            <th scope="col" className="p-4 hidden md:table-cell">Điện thoại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((colleague, index) => (
                            <tr 
                                key={colleague.employeeName} 
                                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                    setSelectedColleague(colleague);
                                    setIsModalOpen(true);
                                }}
                            >
                                <td className="p-4 text-gray-500">
                                    {indexOfFirstItem + index + 1}
                                </td>
                                <td className="p-4">
                                    <img
                                        src={`https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`}
                                        alt={`${colleague.employeeName}'s avatar`}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">
                                        {colleague.employeeName}
                                    </div>
                                    <div className="sm:hidden space-y-1 mt-1">
                                        <div className="text-sm text-blue-600">
                                            {colleague.email}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {colleague.employeePhoneNumber}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 hidden sm:table-cell">
                                    <a href={`mailto:${colleague.email}`}
                                       className="text-blue-600 hover:text-blue-800 hover:underline">
                                        {colleague.email}
                                    </a>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <div className="text-gray-500">
                                        {colleague.employeePhoneNumber}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-lg">
                <div className="flex items-center text-sm text-gray-700">
                    <span>
                        Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, colleagues.length)} trong số {colleagues.length} mục
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Modal */}
            <ColleagueModal 
                colleague={selectedColleague} 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedColleague(null);
                }} 
            />
        </div>
    );
};

export default ColleagueList;
