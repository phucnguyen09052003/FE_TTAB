import { useEffect, useState } from "react";
import axios from "axios";
import { DEPARTMENT_ENDPOINTS } from "../utils/apiEndpoints";

interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  departmentParent: string | null;
  departmentLevel: number;
  companyCode: string;
  companyName: string;
  employeeCount: number;
}

const OrgChart = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Get company code from the JWT token
        let companyCode = "";
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          companyCode = tokenPayload.companyCode;
        } catch (err) {
          console.error("Failed to extract company code from token", err);
          setError("Không tìm thấy mã công ty trong token");
          setLoading(false);
          return;
        }

        const response = await axios.get(DEPARTMENT_ENDPOINTS.BY_COMPANY(companyCode), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.status === 200) {
          setDepartments(response.data.data);
        } else {
          setError("Failed to fetch departments");
        }
      } catch (err) {
        setError("Error fetching department data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Group departments by level
  const departmentsByLevel = departments.reduce((acc, dept) => {
    if (!acc[dept.departmentLevel]) {
      acc[dept.departmentLevel] = [];
    }
    acc[dept.departmentLevel].push(dept);
    return acc;
  }, {} as Record<number, Department[]>);

  // Find root departments (level 1)
  const rootDepartments = departments.filter(dept => dept.departmentLevel === 1);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 flex justify-center items-center h-64">{error}</div>;
  }

  if (departments.length === 0) {
    return <div className="flex justify-center items-center h-64">No departments found</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center p-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <div className="text-center">
            {/* First Level */}
            <div className="flex justify-center space-x-8 relative">
              {rootDepartments.map((dept, index) => (
                <div key={dept.id} className="relative flex flex-col items-center">
                  <div className="w-64 border border-indigo-200 rounded-lg bg-gradient-to-br from-indigo-50 to-white shadow-md">
                    <div className="border-b border-indigo-200 p-3 font-bold text-indigo-900 text-center text-sm md:text-base bg-indigo-50">
                      Phòng ban: {dept.departmentName}
                    </div>
                    <div className="p-4 text-center">
                      <div className="mt-3 text-indigo-600 font-medium text-sm">
                        {dept.employeeCount} thành viên
                      </div>
                    </div>
                  </div>
                  {/* Vertical line and horizontal connector for child departments */}
                  {departmentsByLevel[2]?.length > 0 && (
                    <>
                      <div className="border-l-2 border-indigo-300 h-12"></div>
                      {index === Math.floor(rootDepartments.length / 2) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="border-t-2 border-indigo-300" 
                               style={{
                                 width: `${(departmentsByLevel[2].length - 1) * 288}px`,
                                 position: 'absolute',
                                 left: `-${((departmentsByLevel[2].length - 1) * 288) / 2}px`
                               }}>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Child Departments */}
            {Object.keys(departmentsByLevel)
              .map(Number)
              .filter(level => level > 1)
              .sort((a, b) => a - b)
              .map(level => (
                <div key={level} className="relative mt-0">
                  <div className="flex justify-center space-x-8 pt-12">
                    {departmentsByLevel[level].map((dept, index) => (
                      <div key={dept.id} className="relative">
                        <div className="relative flex flex-col items-center">
                          {/* Vertical line to parent */}
                          <div className="absolute top-[-48px] left-1/2 transform -translate-x-1/2 border-l-2 border-indigo-300 h-12"></div>
                          
                          <div className="w-64 border border-indigo-200 rounded-lg bg-gradient-to-br from-indigo-50 to-white shadow-md">
                            <div className="border-b border-indigo-200 p-3 font-bold text-indigo-900 text-center text-sm md:text-base bg-indigo-50">
                              Phòng ban: {dept.departmentName}
                            </div>
                            <div className="p-4 text-center">
                              <div className="mt-3 text-indigo-600 font-medium text-sm">
                                {dept.employeeCount} thành viên
                              </div>
                            </div>
                          </div>

                          {/* Vertical line and horizontal connector for next level */}
                          {departmentsByLevel[level + 1]?.length > 0 && (
                            <>
                              <div className="border-l-2 border-indigo-300 h-12"></div>
                              {index === Math.floor(departmentsByLevel[level].length / 2) && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                                  <div className="border-t-2 border-indigo-300" 
                                       style={{
                                         width: `${(departmentsByLevel[level + 1].length - 1) * 288}px`,
                                         position: 'absolute',
                                         left: `-${((departmentsByLevel[level + 1].length - 1) * 288) / 2}px`
                                       }}>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
