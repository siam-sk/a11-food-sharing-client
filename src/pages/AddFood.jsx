import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardDocumentListIcon, PhotoIcon, CubeIcon, MapPinIcon, CalendarDaysIcon, ChatBubbleLeftEllipsisIcon, ExclamationTriangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const addNewFood = async (foodData) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn("Auth token not found for adding food. The request will likely fail.");
  }

  const response = await fetch('https://a11-food-sharing-server-three.vercel.app/api/foods', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(foodData),
  });

  if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.message || "Authentication failed. Please login again.");
      throw new Error(errorData.message || "Authentication failed");
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to add food item" }));
    throw new Error(errorData.message || "Failed to add food item");
  }
  return response.json();
};

const AddFood = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        toast.info("Please login to add food.");
        navigate("/login", { state: { from: "/add-food" } });
      }
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const addFoodMutation = useMutation({
    mutationFn: addNewFood,
    onSuccess: () => {
      toast.success("Food item added successfully!");
      queryClient.invalidateQueries({ queryKey: ['availableFoods'] });
      queryClient.invalidateQueries({ queryKey: ['allAvailableFoods'] });
      queryClient.invalidateQueries({ queryKey: ['myFoods'] });
      
      setFoodName("");
      setFoodImage("");
      setFoodQuantity("");
      setPickupLocation("");
      setExpiredDate("");
      setAdditionalNotes("");
      setIsUrgent(false);
      navigate("/manage-my-foods");
    },
    onError: (error) => {
      console.error("Error adding food: ", error);
      toast.error(error.message || "Failed to add food item.");
       if (error.message === "Authentication failed") {
        navigate("/login", { state: { from: "/add-food" } });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add food.");
      navigate("/login", { state: { from: "/add-food" } });
      return;
    }
    if (!foodName || !foodImage || !foodQuantity || !pickupLocation || !expiredDate) {
        toast.error("Please fill in all required fields: Food Name, Image URL, Quantity, Pickup Location, and Expired Date.");
        return;
    }
     if (new Date(expiredDate) < new Date()) {
      toast.error("Expired date cannot be in the past.");
      return;
    }


    const foodData = {
      foodName,
      foodImage,
      foodQuantity: parseInt(foodQuantity, 10),
      pickupLocation,
      expiredDate,
      additionalNotes,
      isUrgent,
      donatorName: user.displayName || "Anonymous",
      donatorEmail: user.email,
      donatorImage: user.photoURL || "https://via.placeholder.com/40",
      userId: user.uid,
      foodStatus: "available",
    };

    addFoodMutation.mutate(foodData);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <span className="loading loading-lg text-sky-600"></span>
        <p className="ml-4 text-lg text-gray-700">Verifying user...</p>
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-10">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-gray-700">You need to be logged in to add food.</p>
        <Link to="/login" state={{ from: "/add-food" }} className="mt-4 btn btn-primary bg-sky-600 hover:bg-sky-700 text-white">
          Go to Login
        </Link>
      </div>
    );
  }


  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <ClipboardDocumentListIcon className="mx-auto h-16 w-auto text-sky-600" />
            <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Share Your Food
            </h1>
            <p className="mt-3 text-lg text-gray-600">
            Fill in the details below to add a new food item to the platform.
            </p>
        </div>

        {user && (
          <div className="mb-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <img 
                src={user.photoURL || "https://via.placeholder.com/100"}
                alt="Donor" 
                className="w-16 h-16 rounded-full object-cover ring-2 ring-sky-500 ring-offset-2" 
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Donor: {user.displayName || "N/A"}</h3>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-500 mt-1">You are currently logged in and adding food as this user.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 shadow-xl rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CubeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="text" id="foodName" value={foodName} onChange={(e) => setFoodName(e.target.value)} required 
                       className="input input-bordered w-full pl-10 focus:ring-primary focus:border-primary"
                       placeholder="e.g., Fresh Apples" />
              </div>
            </div>

            <div>
              <label htmlFor="foodImage" className="block text-sm font-medium text-gray-700 mb-1">Food Image URL</label>
               <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhotoIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="url" id="foodImage" value={foodImage} onChange={(e) => setFoodImage(e.target.value)} required 
                       className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                       placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            <div>
              <label htmlFor="foodQuantity" className="block text-sm font-medium text-gray-700 mb-1">Food Quantity</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CubeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="number" id="foodQuantity" value={foodQuantity} onChange={(e) => setFoodQuantity(e.target.value)} required min="1" 
                       className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                       placeholder="e.g., 5 (servings), 10 (items)" />
              </div>
            </div>

            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required 
                       className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                       placeholder="e.g., Main Street Community Center" />
              </div>
            </div>

            <div>
              <label htmlFor="expiredDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="date" id="expiredDate" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} required min={today}
                       className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 top-0 pt-3 pl-3 flex items-start pointer-events-none">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <textarea id="additionalNotes" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows="3" 
                          className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          placeholder="e.g., Contains nuts, best consumed within 2 days"></textarea>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <p className="text-sm text-gray-700">Food Status: <span className="font-semibold text-green-600">Available</span> (This is set by default)</p>
            </div>

            <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <input
                id="isUrgent"
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="isUrgent" className="ml-2 block text-sm font-medium text-yellow-700">
                Mark as Urgent (e.g., expiring very soon, needs immediate pickup)
              </label>
            </div>

            <button type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50" 
                    disabled={addFoodMutation.isPending || isLoadingUser}>
              {addFoodMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Adding Food...
                </>
              ) : (
                "Add Food Item"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;