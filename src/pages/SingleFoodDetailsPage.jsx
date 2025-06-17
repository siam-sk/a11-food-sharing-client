import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase.init';
import { toast } from 'react-toastify';

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
        const response = await fetch(`http://localhost:3000/api/foods/${foodId}`);
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
    
    setAdditionalNotesModal(foodDetails?.additionalNotes || '');
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
      foodStatus: "requested", 
    };

    try {
      const response = await fetch('http://localhost:3000/api/food-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit request.');
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


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!foodDetails) {
    return <div className="text-center py-10">No food details found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2">
          <img src={foodDetails.foodImage} alt={foodDetails.foodName} className="w-full h-auto object-cover max-h-[500px]" />
        </figure>
        <div className="card-body lg:w-1/2">
          <h1 className="card-title text-3xl md:text-4xl mb-4">{foodDetails.foodName}</h1>
          <div className="mb-2">
            <span className="font-semibold">Donated by: </span>
            <div className="flex items-center mt-1">
              <img src={foodDetails.donatorImage || 'https://via.placeholder.com/40'} alt={foodDetails.donatorName} className="w-8 h-8 rounded-full mr-2" />
              <span>{foodDetails.donatorName} ({foodDetails.donatorEmail})</span>
            </div>
          </div>
          <p><span className="font-semibold">Quantity:</span> {foodDetails.foodQuantity}</p>
          <p><span className="font-semibold">Pickup Location:</span> {foodDetails.pickupLocation}</p>
          <p><span className="font-semibold">Expires On:</span> {new Date(foodDetails.expiredDate).toLocaleDateString()}</p>
          <p><span className="font-semibold">Status:</span> <span className="badge badge-lg badge-success">{foodDetails.foodStatus}</span></p>
          {foodDetails.additionalNotes && (
            <div className="mt-4">
              <h3 className="font-semibold">Additional Notes from Donor:</h3>
              <p className="bg-base-200 p-3 rounded-md mt-1">{foodDetails.additionalNotes}</p>
            </div>
          )}
          <div className="card-actions justify-end mt-6">
            {foodDetails.foodStatus === 'available' && user && user.email !== foodDetails.donatorEmail && (
              <button onClick={openRequestModal} className="btn btn-primary">
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
                 <button onClick={openRequestModal} className="btn btn-primary">
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
              <div>
                <label className="label"><span className="label-text">Food Name</span></label>
                <input type="text" value={foodDetails.foodName} readOnly className="input input-bordered w-full input-disabled" />
              </div>
              <div className="text-center my-2">
                <img src={foodDetails.foodImage} alt={foodDetails.foodName} className="max-h-40 mx-auto rounded-md" />
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