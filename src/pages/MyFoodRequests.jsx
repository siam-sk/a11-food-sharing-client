import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase.init';
import { toast } from 'react-toastify';

const MyFoodRequests = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRequests = useCallback(async (firebaseUserEmail) => {
    if (!firebaseUserEmail) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      toast.warn("Authentication token not found. Please log in again.");
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://a11-food-sharing-server-three.vercel.app/api/my-food-requests`, { headers });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.message || "Authentication failed. Please login again.");
        navigate('/login');
        throw new Error(errData.message || 'Authentication failed.');
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch your food requests.');
      }
      const data = await response.json();
      setMyRequests(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching my food requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMyRequests(currentUser.email);
      } else {
        setUser(null);
        setMyRequests([]);
        setIsLoading(false);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, fetchMyRequests]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!user) {
    return <div className="text-center py-10">Please log in to see your food requests.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Food Requests</h1>
      {myRequests.length === 0 ? (
        <p className="text-center text-xl">You haven't made any food requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Donator Name</th>
                <th>Pickup Location</th>
                <th>Food Expire Date</th>
                <th>Request Date</th>
                <th>Your Notes</th>
                
              </tr>
            </thead>
            <tbody>
              {myRequests.map(request => (
                <tr key={request._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={request.foodImage} alt={request.foodName} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{request.foodName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{request.foodDonatorName}</td>
                  <td>{request.pickupLocation}</td>
                  <td>{request.expiredDate ? new Date(request.expiredDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{request.requestDate ? new Date(request.requestDate).toLocaleString() : 'N/A'}</td>
                  <td>{request.additionalNotes || "N/A"}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFoodRequests;