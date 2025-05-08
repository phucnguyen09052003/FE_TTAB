
// Environment type
export const ENV = import.meta.env.MODE || 'development';

// API configuration
export const API_CONFIG = {
  // API base URL - can be changed based on environment
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://103.166.143.198:9000',
  
  // API prefix
  PREFIX: import.meta.env.VITE_API_PREFIX || '/api',
};

// Build the complete API URL
export const API_BASE_URL = 
  ENV === 'production' 
    ? (import.meta.env.VITE_API_BASE_URL || 'http://103.166.143.198:9000')
    : 'http://103.166.143.198:9000';

export default {
  ENV,
  API_CONFIG,
  API_BASE_URL
}; 