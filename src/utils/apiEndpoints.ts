import { API_BASE_URL } from './env.config';


// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
};

// Employee endpoints
export const EMPLOYEE_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/api/employee/profile`,
  BY_CODE: (code: string) => `${API_BASE_URL}/api/employee/${code}`,
  CHANGE_PASSWORD: (code: string) => `${API_BASE_URL}/api/employee/${code}/change-password`,
  COLLEAGUES: (page: number, size: number) => `${API_BASE_URL}/api/employee/same-company?page=${page}&size=${size}`,
};

export const INFO_EMPLOYEE_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/api/info-employee/profile`,
  INFO_EMPLOYEE: (code: string) => `${API_BASE_URL}/api/info-employee/${code}`,
  CHANGE_PASSWORD: (code: string) => `${API_BASE_URL}/api/info-employee/${code}/change-password`,
  COLLEAGUES: `${API_BASE_URL}/api/info-employee/same-company`,
};

export const SALARY_ENDPOINTS = {
  SALARY: (employeeCode: string, year: string) => `${API_BASE_URL}/api/salary/employee/${employeeCode}/salary/${year}`,
};


// Department endpoints
export const DEPARTMENT_ENDPOINTS = {
  BY_COMPANY: (companyCode: string) => `${API_BASE_URL}/api/department/company/${companyCode}`,
};

export const PROMOTION_ENDPOINTS = {
  PROMOTION: (params: any) => {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');
    return `${API_BASE_URL}/api/coupon${queryString ? `?${queryString}` : ''}`;
  },
};
export const COMPANY_ENDPOINTS = {
  COMPANY: `${API_BASE_URL}/api/company/list`,
};
// Export all endpoints
export default {
  BASE_URL: API_BASE_URL,
  AUTH: AUTH_ENDPOINTS,
  EMPLOYEE: EMPLOYEE_ENDPOINTS,
  DEPARTMENT: DEPARTMENT_ENDPOINTS,
  INFO_EMPLOYEE: INFO_EMPLOYEE_ENDPOINTS,
  SALARY: SALARY_ENDPOINTS,
  PROMOTION: PROMOTION_ENDPOINTS,
  COMPANY: COMPANY_ENDPOINTS,
}; 