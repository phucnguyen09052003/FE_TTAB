import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch, FaSync } from 'react-icons/fa';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { COMPANY_ENDPOINTS, PROMOTION_ENDPOINTS } from "../utils/apiEndpoints";
const Promotion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  interface Promotion {
    id: string;
    companyName: string;
    companyCode: string;
    couponCode: string;
    couponName: string;
    couponDateStart: string;
    couponDiscount: string;
    couponDiscountType: string;
  }

  interface Company {
    id: string;
    companyCode: string;
    companyName: string;
  }

  // Fixed discount options
  const DISCOUNT_OPTIONS = [
    { value: "5", label: "5%" },
    { value: "10", label: "10%" },
    { value: "15", label: "15%" },
    { value: "20", label: "20%" },
    { value: "25", label: "25%" },
    { value: "30", label: "30%" },
    { value: "40", label: "40%" },
    { value: "50", label: "50%" },
  ];

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 15, 20];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token đăng nhập");
        }

        const response = await axios.get(COMPANY_ENDPOINTS.COMPANY, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCompanies(response.data.data || []);
      } catch (err: any) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch promotions with applied filters
  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      // Build query parameters
      const params: Record<string, string> = {};
      
      if (searchTerm) {
        if (searchTerm.length <= 10 || /^[A-Z0-9\-\_]+$/.test(searchTerm)) {
          params.couponCode = searchTerm;
        } else {
          params.couponName = searchTerm;
        }
      }
      
      if (filterCompany) {
        params.companyCode = filterCompany;
      }
      
      if (filterDiscount) {
        params.couponDiscount = filterDiscount;
      }
      
      if (filterDate) {
        params.couponDateStart = filterDate;
      }
      
      // Use a single API endpoint with or without query parameters
      const url = PROMOTION_ENDPOINTS.PROMOTION(params);
        
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const content = response.data.data.content || [];
      setPromotions(content);
      setTotalElements(response.data.data.totalElements || 0);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
      setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPromotions();
  }, []); 

  // Fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPromotions();
    }, 300); // Debounce for filter changes

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterCompany, filterDiscount, filterDate]);

  // Reset page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filterCompany, filterDiscount, filterDate, searchTerm]);

  const handleSort = (field: string) => {
    // Client-side sorting only
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data client-side
  const sortedData = [...promotions].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'discount') {
      const aValue = Number(a.couponDiscount);
      const bValue = Number(b.couponDiscount);
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (sortField === 'date') {
      const aValue = new Date(a.couponDateStart).getTime();
      const bValue = new Date(b.couponDateStart).getTime();
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const exportToExcel = () => {
    const exportData = promotions.map((promo, index) => ({
      'STT': index + 1,
      'Mã Khuyến Mãi': promo.couponCode,
      'Tên Khuyến Mãi': promo.couponName,
      'Công Ty': promo.companyName,
      'Giảm Giá': `${promo.couponDiscount}%`,
      'Ngày Bắt Đầu': new Date(promo.couponDateStart).toLocaleDateString("vi-VN")
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Khuyến Mãi");
    XLSX.writeFile(wb, `Danh_sach_khuyen_mai_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleRefresh = () => {
    fetchPromotions();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCompany("");
    setFilterDiscount("");
    setFilterDate("");
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:p-6 text-sm md:text-base overflow-x-hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold">KHUYẾN MÃI</h2>
          </div>
          
          <hr className="mt-6 md:mt-8 mb-4 border-gray-500" />

          {error && (
            <div className="mb-4 px-3 md:px-4 py-2 md:py-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-6 relative z-0">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo mã hoặc tên khuyến mãi..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  disabled={isLoading}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow-sm transition duration-200"
                disabled={isLoading}
              >
                <FaSync className={`${isLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-sm transition duration-200"
                disabled={isLoading}
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Công ty</label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading || isLoadingCompanies}
                >
                  <option value="">Tất cả công ty</option>
                  {isLoadingCompanies ? (
                    <option disabled>Đang tải dữ liệu...</option>
                  ) : (
                    companies.map(company => (
                      <option key={company.id} value={company.companyCode}>
                        {company.companyCode} - {company.companyName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Discount Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Mức giảm giá</label>
                <select
                  value={filterDiscount}
                  onChange={(e) => setFilterDiscount(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Tất cả mức giảm</option>
                  {DISCOUNT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Filter summary */}
          <div className="mt-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <div className="text-sm text-indigo-800">
              <span className="font-medium">Bộ lọc hiện tại: </span>
              {!filterCompany && !filterDiscount && !filterDate && !searchTerm ? (
                <span className="italic text-gray-600">Không có bộ lọc nào được áp dụng</span>
              ) : (
                <span>
                  {searchTerm && <span className="mr-2 bg-indigo-100 px-2 py-1 rounded">Tìm kiếm: {searchTerm}</span>}
                  {filterCompany && <span className="mr-2 bg-indigo-100 px-2 py-1 rounded">Công ty: {companies.find(c => c.companyCode === filterCompany)?.companyName || filterCompany}</span>}
                  {filterDiscount && <span className="mr-2 bg-indigo-100 px-2 py-1 rounded">Mức giảm: {filterDiscount}%</span>}
                  {filterDate && <span className="mr-2 bg-indigo-100 px-2 py-1 rounded">Ngày: {filterDate}</span>}
                </span>
              )}
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 border border-indigo-200 rounded-lg">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-indigo-700 font-medium">Đang tải dữ liệu...</span>
              </div>
            </div>
          )}

          {/* Items per page and Export section */}
          <div className="flex items-center justify-between mb-4 space-x-4 mt-8">
            <div className="text-sm text-gray-600">
              Tổng số: <span className="font-medium">{promotions.length}</span> mục
              {promotions.length !== totalElements && 
                <span className="italic ml-1">(Tổng trong hệ thống: {totalElements})</span>
              }
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-600">Hiển thị:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">mục mỗi trang</span>
              </div>

              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow text-sm font-medium"
              >
                <FaFileExcel className="text-base" />
                <span>Xuất File</span>
              </button>
            </div>
          </div>

          {/* Results count */}
          {!isLoading && promotions.length === 0 && (
            <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-700">Không tìm thấy dữ liệu khuyến mãi phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}

          {!isLoading && promotions.length > 0 && (
            <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">Tên</div>
                      </th>
                      <th className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
                      <th 
                        className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('discount')}
                      >
                        <div className="flex items-center">
                          Giảm giá
                          {sortField === 'discount' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          Ngày bắt đầu
                          {sortField === 'date' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((promo, index) => (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-sm text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <div className="text-sm font-medium text-blue-600">{promo.couponCode}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1">{promo.companyName}</div>
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <div className="text-sm text-gray-900">{promo.couponName}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1">
                            {new Date(promo.couponDateStart).toLocaleDateString("vi-VN")}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-sm text-gray-600">{promo.companyName}</td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {promo.couponDiscount}%
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-sm text-gray-500">
                          {new Date(promo.couponDateStart).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {promotions.length > 0 && (
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, sortedData.length)} trong số {sortedData.length} mục
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
                  Trang {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Promotion;
