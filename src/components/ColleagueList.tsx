import { useState, useEffect } from 'react';
import axios from 'axios';
import { EMPLOYEE_ENDPOINTS } from '../utils/apiEndpoints';
interface Colleague {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  email: string;
  employeePhoneNumber: string;
  employeeLastLogin: string | null;
  employeeActive: number;
  companyCode: string;
  companyName: string;
}

interface PaginatedResponse {
  content: Colleague[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
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
                <label className="text-sm font-medium text-gray-500">Mã nhân viên</label>
                <p className="mt-1 text-gray-900">{colleague.employeeCode}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-blue-600">{colleague.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <p className="mt-1 text-gray-900">{colleague.employeePhoneNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Công ty</label>
                <p className="mt-1 text-gray-900">{colleague.companyName} ({colleague.companyCode})</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${colleague.employeeActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {colleague.employeeActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </p>
              </div>

              {colleague.employeeLastLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Đăng nhập gần nhất</label>
                  <p className="mt-1 text-gray-900">{new Date(colleague.employeeLastLogin).toLocaleString()}</p>
                </div>
              )}
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
    const [filteredColleagues, setFilteredColleagues] = useState<Colleague[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0); // API uses 0-based pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const itemsPerPageOptions = [5, 10, 15, 20];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(0); // Reset về trang đầu tiên khi search
        fetchColleagues(0, itemsPerPage);
    }, [debouncedSearchTerm, itemsPerPage]);

    useEffect(() => {
        fetchColleagues(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredColleagues(colleagues);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = colleagues.filter(colleague => 
            colleague.employeeName.toLowerCase().includes(searchTermLower) ||
            colleague.employeeCode.toLowerCase().includes(searchTermLower)
        );
        
        setFilteredColleagues(filtered);
        setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    }, [searchTerm, colleagues]);

    const fetchColleagues = async (page: number, size: number) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            let url = EMPLOYEE_ENDPOINTS.COLLEAGUES(page, size);
            if (debouncedSearchTerm) {
                url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.status === 200) {
                const paginatedData = response.data.data as PaginatedResponse;
                setColleagues(paginatedData.content);
            } else {
                setError('Failed to fetch colleagues data');
            }
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

    if (loading && colleagues.length === 0) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    // Tính toán phân trang cho dữ liệu đã lọc
    const paginatedColleagues = filteredColleagues.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Cập nhật các giá trị tính toán
    const totalItems = filteredColleagues.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = currentPage * itemsPerPage + 1;
    const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

    return (
        <div className="w-full overflow-hidden">
            {/* Add title */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                THÔNG TIN ĐỒNG NGHIỆP
            </h2>

            {/* Search box */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Items per page selector */}
            <div className="flex items-center justify-end mb-4 space-x-4">
                <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-600">Hiển thị:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(0); // Reset to first page when changing items per page
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
                            <th scope="col" className="p-4">Mã nhân viên</th>
                            <th scope="col" className="p-4 hidden sm:table-cell">Email</th>
                            <th scope="col" className="p-4 hidden md:table-cell">Điện thoại</th>
                            <th scope="col" className="p-4 hidden lg:table-cell">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedColleagues.map((colleague, index) => (
                            <tr 
                                key={colleague.employeeId} 
                                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                    setSelectedColleague(colleague);
                                    setIsModalOpen(true);
                                }}
                            >
                                <td className="p-4 text-gray-500">
                                    {startItem + index}
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
                                </td>
                                <td className="p-4">
                                    <div className="text-gray-500">
                                        {colleague.employeeCode}
                                    </div>
                                </td>
                                <td className="p-4 hidden sm:table-cell">
                                    <div className="text-blue-600">
                                        {colleague.email}
                                    </div>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <div className="text-gray-500">
                                        {colleague.employeePhoneNumber}
                                    </div>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                    <span className={`px-2 py-1 text-xs rounded-full ${colleague.employeeActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {colleague.employeeActive ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
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
                        Hiển thị {startItem} đến {endItem} trong số {totalItems} mục
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
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
