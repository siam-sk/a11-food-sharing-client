import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

  const response = await fetch('http://localhost:3000/api/foods', {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const addFoodMutation = useMutation({
    mutationFn: addNewFood,
    onSuccess: () => {
      toast.success("Food item added successfully!");
      queryClient.invalidateQueries({ queryKey: ['availableFoods'] });
      
      setFoodName("");
      setFoodImage("");
      setFoodQuantity("");
      setPickupLocation("");
      setExpiredDate("");
      setAdditionalNotes("");
      setIsUrgent(false);
      navigate("/available-foods");
    },
    onError: (error) => {
      console.error("Error adding food: ", error);
      toast.error(error.message || "Failed to add food item.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add food.");
      navigate("/login");
      return;
    }
    if (!foodName || !foodImage || !foodQuantity || !pickupLocation || !expiredDate) {
        toast.error("Please fill in all required fields.");
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

  if (!user && auth.currentUser === null && addFoodMutation.isLoading) {
    return <div className="text-center p-10">Verifying user...</div>;
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Food Item</h1>
      {user && (
        <div className="mb-6 p-4 border rounded-lg bg-base-200">
          <h3 className="text-lg font-semibold">Donor Information:</h3>
          <div className="flex items-center space-x-3 mt-2">
            <img src={user.photoURL || "https://via.placeholder.com/40"} alt="Donor" className="w-10 h-10 rounded-full" />
            <div>
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
          <input type="text" id="foodName" value={foodName} onChange={(e) => setFoodName(e.target.value)} required className="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label htmlFor="foodImage" className="block text-sm font-medium text-gray-700">Food Image URL</label>
          <input type="url" id="foodImage" value={foodImage} onChange={(e) => setFoodImage(e.target.value)} required className="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label htmlFor="foodQuantity" className="block text-sm font-medium text-gray-700">Food Quantity (e.g., number of items, servings)</label>
          <input type="number" id="foodQuantity" value={foodQuantity} onChange={(e) => setFoodQuantity(e.target.value)} required min="1" className="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
          <input type="text" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required className="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label htmlFor="expiredDate" className="block text-sm font-medium text-gray-700">Expired Date</label>
          <input type="date" id="expiredDate" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} required className="input input-bordered w-full mt-1" />
        </div>
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea id="additionalNotes" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows="3" className="textarea textarea-bordered w-full mt-1"></textarea>
        </div>
        <div>
            <p className="text-sm text-gray-600">Food Status: <span className="font-semibold">Available</span> (default)</p>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Mark as Urgent (e.g., expiring soon)</span>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="checkbox checkbox-warning"
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={addFoodMutation.isPending}>
          {addFoodMutation.isPending ? <span className="loading loading-spinner"></span> : "Add Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;