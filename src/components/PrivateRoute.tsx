import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../utils/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkTokenExpiration()) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PrivateRoute;
