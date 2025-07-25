import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase.init';

const PublicOnlyRoute = ({ children }) => {
  const auth = getAuth(app);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (user) {
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicOnlyRoute;