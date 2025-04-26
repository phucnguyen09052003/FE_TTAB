import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Promotion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  interface Promotion {
    id: string;
    companyName: string;
    couponCode: string;
    couponName: string;
    couponDateStart: string;
    couponDiscount: string;
    couponDiscountType: string;
  }

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const itemsPerPageOptions = [5, 10, 15, 20];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/coupon", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPromotions(response.data.data.content || []);
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Handle unauthorized error - redirect to login
          window.location.href = "/login";
        }
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
        console.error("Lỗi:", err);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!searchTerm) {
          const response = await axios.get("http://localhost:8080/api/coupon", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPromotions(response.data.data.content || []);
          return;
        }

        // First try searching by couponCode
        let response = await axios.get(
          `http://localhost:8080/api/coupon/search?couponCode=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If no results found by couponCode, try searching by couponName
        if (!response.data.data.content?.length) {
          response = await axios.get(
            `http://localhost:8080/api/coupon/search?couponName=${searchTerm}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            } 
          );
        }

        setPromotions(response.data.data.content || []);
      } catch (err: any) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
        console.error("Lỗi:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCompany, filterDiscount, filterDate]);

  const filteredData = promotions.filter(promo => {
    const matchesCompany = !filterCompany || promo.companyName === filterCompany;
    const matchesDiscount = !filterDiscount || 
      Number(promo.couponDiscount) === Number(filterDiscount);
    const matchesDate = !filterDate || 
      new Date(promo.couponDateStart).toISOString().split('T')[0] === filterDate;

    return matchesCompany && matchesDiscount && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

          <div className="mt-6 space-y-6 relative z-0"> {/* Add z-0 here */}
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo mã hoặc tên khuyến mãi..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
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
                >
                  <option value="">Tất cả công ty</option>
                  {[...new Set(promotions.map(p => p.companyName))].map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* Discount Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Mức giảm giá</label>
                <select
                  value={filterDiscount}
                  onChange={(e) => setFilterDiscount(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Tất cả mức giảm</option>
                  {[...new Set(promotions.map(p => Number(p.couponDiscount)))]
                    .sort((a, b) => a - b)
                    .map(discount => (
                      <option key={discount} value={discount}>{discount}%</option>
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
                />
              </div>
            </div>
          </div>

          {/* Items per page and Export section */}
          <div className="flex items-center justify-end mb-4 space-x-4 mt-8">
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
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                    <th className="hidden md:table-cell px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
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

          <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, filteredData.length)} trong số {filteredData.length} mục
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
        </main>
      </div>
    </div>
  );
};

export default Promotion;
