import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      // Token has expired
      localStorage.clear(); // Clear all localStorage data
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.clear();
    return false;
  }
};

export const useAuthCheck = () => {
  const navigate = useNavigate();

  const checkAndRedirect = () => {
    if (!checkTokenExpiration()) {
      navigate('/login');
      return false;
    }
    return true;
  };

  return checkAndRedirect;
};
