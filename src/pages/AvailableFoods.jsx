import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';


const FoodItemCard = ({ food, onNavigateToDetails }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <figure className="relative"> 
        <img src={food.foodImage} alt={food.foodName} className="h-48 w-full object-cover" />
        {food.isUrgent && (
          <div className="badge badge-error gap-2 absolute top-2 right-2 font-semibold">
            URGENT
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {food.foodName}
        </h2>
        <div className="flex items-center my-2">
          <img src={food.donatorImage || 'https://via.placeholder.com/40'} alt={food.donatorName} className="w-8 h-8 rounded-full mr-2" />
          <span className="text-sm font-medium">{food.donatorName}</span>
        </div>
        <p>Quantity: {food.foodQuantity}</p>
        <p>Pickup: {food.pickupLocation}</p>
        <p>Expires: {food.expiredDate ? new Date(food.expiredDate).toLocaleDateString() : 'N/A'}</p>
        {food.additionalNotes && <p className="text-sm text-gray-500 mt-1">Notes: {food.additionalNotes}</p>}
        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => onNavigateToDetails(food._id)}
            className="btn btn-primary btn-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const fetchAvailableFoods = async () => {
  const response = await fetch('http://localhost:3000/api/foods');
  if (!response.ok) {
    throw new Error('Network response was not ok while fetching available foods');
  }
  return response.json();
};

const AvailableFoods = () => {
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [isThreeColumnLayout, setIsThreeColumnLayout] = useState(true);

  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  
  const { data: allFoods = [], isLoading, error } = useQuery({
    queryKey: ['availableFoods'],
    queryFn: fetchAvailableFoods,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    let foodsToDisplay = [...allFoods];

    if (searchTerm) {
      foodsToDisplay = foodsToDisplay.filter(food =>
        food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder !== "default") {
      foodsToDisplay.sort((a, b) => {
        const dateA = new Date(a.expiredDate);
        const dateB = new Date(b.expiredDate);
        if (sortOrder === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }
    setDisplayedFoods(foodsToDisplay);
  }, [allFoods, sortOrder, searchTerm]);


  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleLayout = () => {
    setIsThreeColumnLayout(prev => !prev);
  };

  const handleViewDetails = (foodId) => {
    if (!user) {
      navigate("/login", { state: { from: `/food/${foodId}` } });
    } else {
      navigate(`/food/${foodId}`);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error fetching foods: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Foods</h1>

      
      <div className="mb-6 p-4 bg-base-200 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <label htmlFor="searchFood" className="label">
            <span className="label-text">Search by Food Name:</span>
          </label>
          <input
            type="text"
            id="searchFood"
            placeholder="E.g., Apples, Bread"
            className="input input-bordered w-full md:w-auto"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2"> 
          <span className="label-text">Sort by Expire Date:</span>
          <button
            onClick={() => handleSortChange('asc')}
            className={`btn btn-sm ${sortOrder === 'asc' ? 'btn-active btn-primary' : 'btn-outline'}`}
          >
            Nearest First
          </button>
          <button
            onClick={() => handleSortChange('desc')}
            className={`btn btn-sm ${sortOrder === 'desc' ? 'btn-active btn-primary' : 'btn-outline'}`}
          >
            Furthest First
          </button>
          {sortOrder !== 'default' && (
             <button
                onClick={() => handleSortChange('default')}
                className="btn btn-sm btn-ghost"
            >
                Clear Sort
            </button>
          )}
          <button 
            onClick={toggleLayout}
            className="btn btn-sm btn-accent"
            title={isThreeColumnLayout ? "Switch to 2 Columns" : "Switch to 3 Columns"}
          >
            {isThreeColumnLayout ? "Layout: ▦" : "Layout: ⬓"} 
          </button>
        </div>
      </div>

      
      {displayedFoods.length > 0 ? (
        <div className={`grid gap-6 ${isThreeColumnLayout ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}> {/* Dynamic grid columns */}
          {displayedFoods.map(food => (
            <FoodItemCard key={food._id} food={food} onNavigateToDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 mt-10">
          {searchTerm ? "No food items match your search." : "No food items currently available."}
        </p>
      )}
    </div>
  );
};

export default AvailableFoods;