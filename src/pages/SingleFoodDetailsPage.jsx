import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase.init';
import { toast } from 'react-toastify';
import { CalendarDaysIcon, UserCircleIcon, ExclamationTriangleIcon, ClockIcon, MapPinIcon, CubeIcon, ChatBubbleLeftEllipsisIcon, EnvelopeIcon, FireIcon } from '@heroicons/react/24/outline';

const SingleFoodDetailsPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalNotesModal, setAdditionalNotesModal] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://a11-food-sharing-server-three.vercel.app/api/foods/${foodId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Food item not found.');
          }
          throw new Error('Failed to fetch food details.');
        }
        const data = await response.json();
        setFoodDetails(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (foodId) {
      fetchFoodDetails();
    }
  }, [foodId]);

  const openRequestModal = () => {
    if (!user) {
      toast.info("Please login to request food.");
      navigate('/login', { state: { from: `/food/${foodId}` } });
      return;
    }
    setAdditionalNotesModal('');
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setAdditionalNotesModal('');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!user || !foodDetails) {
      toast.error("Cannot submit request. User or food details missing.");
      return;
    }

    setIsSubmittingRequest(true);
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      setIsSubmittingRequest(false);
      navigate('/login');
      return;
    }

    const requestData = {
      foodId: foodDetails._id,
      foodName: foodDetails.foodName,
      foodImage: foodDetails.foodImage,
      foodDonatorEmail: foodDetails.donatorEmail,
      foodDonatorName: foodDetails.donatorName,
      requesterEmail: user.email,
      requesterName: user.displayName || "Anonymous Requester",
      requestDate: new Date().toISOString(),
      pickupLocation: foodDetails.pickupLocation,
      expiredDate: foodDetails.expiredDate,
      additionalNotes: additionalNotesModal,
      originalFoodNotes: foodDetails.additionalNotes,
    };

    try {
      const response = await fetch('https://a11-food-sharing-server-three.vercel.app/api/food-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.message || "Authentication failed. Please login again.");
        navigate('/login');
        throw new Error(errData.message || 'Authentication failed.');
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to submit request.' }));
        throw new Error(errData.message);
      }
      toast.success('Food request submitted successfully!');
      setFoodDetails(prevDetails => ({ ...prevDetails, foodStatus: "requested" }));
      closeRequestModal();
    } catch (err) {
      toast.error(err.message);
      console.error("Request submission error:", err);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  function getTimeLeft(expiry) {
    if (!expiry) return "";
    const now = new Date();
    const exp = new Date(expiry);
    const diff = exp - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} left`;
    return "Less than a minute left";
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-sky-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  if (!foodDetails) {
    return <div className="text-center py-10">No food details found.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-sky-700 p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={foodDetails.foodImage}
            alt={foodDetails.foodName}
            className="rounded-lg shadow-lg w-full max-w-xs h-56 object-cover border-4 border-white"
          />
          <div className="flex-1 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-2">
              <CubeIcon className="h-8 w-8 inline-block" /> {foodDetails.foodName}
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge badge-lg ${foodDetails.foodStatus === "available" ? "badge-success" : "badge-warning"} text-white`}>
                {foodDetails.foodStatus.charAt(0).toUpperCase() + foodDetails.foodStatus.slice(1)}
              </span>
              {foodDetails.isUrgent && (
                <span className="badge badge-error badge-lg flex items-center gap-1 text-white">
                  <FireIcon className="h-4 w-4" /> Urgent
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-base">
              <div className="flex items-center gap-1">
                <CubeIcon className="h-5 w-5" />
                <span>Quantity: <span className="font-semibold">{foodDetails.foodQuantity}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-5 w-5" />
                <span>Pickup: <span className="font-semibold">{foodDetails.pickupLocation}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Expires: <span className="font-semibold">{new Date(foodDetails.expiredDate).toLocaleDateString()}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-5 w-5" />
                <span>{getTimeLeft(foodDetails.expiredDate)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CubeIcon className="h-6 w-6 text-sky-600" /> Food Details
                </h2>
                <p className="text-base-content/80">{foodDetails.additionalNotes || "No additional notes provided by the donor."}</p>
              </div>
              <div className="bg-base-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UserCircleIcon className="h-6 w-6 text-sky-600" /> Donor Information
                </h2>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={foodDetails.donatorImage || 'https://via.placeholder.com/40'}
                    alt={foodDetails.donatorName}
                    className="w-12 h-12 rounded-full border-2 border-sky-400 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{foodDetails.donatorName}</div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <EnvelopeIcon className="h-4 w-4" />
                      <a href={`mailto:${foodDetails.donatorEmail}`} className="hover:underline">{foodDetails.donatorEmail}</a>
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm mb-2">
                  <span className="font-medium">Food posted:</span>{" "}
                  {foodDetails.createdAt ? new Date(foodDetails.createdAt).toLocaleString() : "Unknown"}
                </div>
                {foodDetails.isUrgent && (
                  <div className="text-red-600 font-semibold flex items-center gap-1 mb-2">
                    <FireIcon className="h-5 w-5" /> Marked as urgent by donor
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row md:justify-end gap-4">
            {foodDetails.foodStatus === 'available' && user && user.email !== foodDetails.donatorEmail && (
              <button onClick={openRequestModal} className="btn btn-primary btn-lg">
                Request This Food
              </button>
            )}
            {foodDetails.foodStatus === 'available' && user && user.email === foodDetails.donatorEmail && (
              <p className="text-sm text-info">You cannot request your own donated food.</p>
            )}
            {foodDetails.foodStatus !== 'available' && (
              <p className="text-sm text-warning">This food is currently not available for request.</p>
            )}
            {!user && foodDetails.foodStatus === 'available' && (
              <button onClick={openRequestModal} className="btn btn-primary btn-lg">
                Request This Food (Login Required)
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <dialog id="request_food_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeRequestModal}>✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Request Food: {foodDetails.foodName}</h3>
            <form onSubmit={handleRequestSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label"><span className="label-text">Food Name</span></label>
                  <input type="text" value={foodDetails.foodName} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Food ID</span></label>
                  <input type="text" value={foodDetails._id} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Donator</span></label>
                  <input type="text" value={`${foodDetails.donatorName} (${foodDetails.donatorEmail})`} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Your Email (Requester)</span></label>
                  <input type="text" value={user?.email || ''} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Request Date</span></label>
                  <input type="text" value={new Date().toLocaleString()} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Pickup Location</span></label>
                  <input type="text" value={foodDetails.pickupLocation} readOnly className="input input-bordered w-full input-disabled" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Expire Date</span></label>
                  <input type="text" value={new Date(foodDetails.expiredDate).toLocaleDateString()} readOnly className="input input-bordered w-full input-disabled" />
                </div>
              </div>
              <div>
                <label className="label"><span className="label-text">Your Additional Notes (Optional)</span></label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  placeholder="Any specific requests or information for the donor..."
                  value={additionalNotesModal}
                  onChange={(e) => setAdditionalNotesModal(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-action mt-4">
                <button type="button" className="btn" onClick={closeRequestModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? <span className="loading loading-spinner"></span> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeRequestModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default SingleFoodDetailsPage;