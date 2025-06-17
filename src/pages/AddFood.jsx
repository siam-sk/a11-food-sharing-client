import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";

const AddFood = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [expiredDate, setExpiredDate] = useState(""); // Changed from expiredDateTime
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        // No need to navigate here, PrivateRoute handles unauthorized access
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add food.");
      navigate("/login"); // Should be handled by PrivateRoute, but good fallback
      return;
    }
    if (!foodName || !foodImage || !foodQuantity || !pickupLocation || !expiredDate) { // Changed from expiredDateTime
        toast.error("Please fill in all required fields.");
        return;
    }

    setIsLoading(true);

    const foodData = {
      foodName,
      foodImage,
      foodQuantity: parseInt(foodQuantity, 10),
      pickupLocation,
      expiredDate, // Changed from expiredDateTime
      additionalNotes,
      donatorName: user.displayName || "Anonymous",
      donatorEmail: user.email,
      donatorImage: user.photoURL || "https://via.placeholder.com/40",
      userId: user.uid,
      foodStatus: "available",
    };

    console.log("Sending foodData:", foodData); // Add this line to check the value

    try {
      const response = await fetch('http://localhost:3000/api/foods', { // Ensure your server port is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optional: You might want to send an auth token for backend verification
          // 'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add food item");
      }

      // const result = await response.json(); // Contains insertedId
      toast.success("Food item added successfully!");
      
      setFoodName("");
      setFoodImage("");
      setFoodQuantity("");
      setPickupLocation("");
      setExpiredDate(""); // Changed from expiredDateTime
      setAdditionalNotes("");
      navigate("/available-foods");
    } catch (error) {
      console.error("Error adding food: ", error);
      toast.error(error.message || "Failed to add food item.");
    } finally {
      setIsLoading(false);
    }
  };

  // This loading state is for user auth, PrivateRoute also has a loading state
  if (!user && auth.currentUser === null) {
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
          <label htmlFor="expiredDate" className="block text-sm font-medium text-gray-700">Expired Date</label> {/* Changed label */}
          <input type="date" id="expiredDate" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} required className="input input-bordered w-full mt-1" /> {/* Changed type and id */}
        </div>
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea id="additionalNotes" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows="3" className="textarea textarea-bordered w-full mt-1"></textarea>
        </div>
        <div>
            <p className="text-sm text-gray-600">Food Status: <span className="font-semibold">Available</span> (default)</p>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;