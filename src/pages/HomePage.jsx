import { useState, useEffect, useMemo } from "react"; 
import { Link, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'; 


const fetchCoreFoodsData = async () => {
  const response = await fetch('http://localhost:3000/api/foods');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch foods' }));
    throw new Error(errorData.message || 'Network response was not ok while fetching foods for homepage');
  }
  return response.json();
};


const FoodItemCard = ({ food, onNavigateToDetails }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl overflow-hidden flex flex-col h-full" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <figure className="relative h-40 flex-shrink-0"> 
        <img src={food.foodImage} alt={food.foodName} className="w-full h-full object-cover" />
        {food.isUrgent && (
          <div className="badge badge-error gap-1 absolute top-2 right-2 font-semibold text-white p-2 text-xs">
            URGENT
          </div>
        )}
      </figure>
      <div className="card-body p-3 flex flex-col flex-grow">  
        <h2 className="card-title text-lg lg:text-xl font-semibold mb-0.5 truncate" title={food.foodName}> 
          {food.foodName}
        </h2>
        
        <div className="flex items-center mb-1"> 
          <div className="avatar mr-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src={food.donatorImage || 'https://via.placeholder.com/40'} alt={food.donatorName || 'Donor'} />
            </div>
          </div>
          <span className="text-sm lg:text-base text-gray-600 truncate" title={food.donatorName || 'Anonymous Donor'}> 
            {food.donatorName || 'Anonymous Donor'}
          </span>
        </div>

        <div className="text-sm text-gray-500 space-y-0.5 mb-1"> 
          <p><span className="font-medium">Quantity:</span> {food.foodQuantity}</p>
          <p className="truncate" title={food.pickupLocation}><span className="font-medium">Pickup:</span> {food.pickupLocation}</p>
          <p><span className="font-medium">Expires:</span> {food.expiredDate ? new Date(food.expiredDate).toLocaleDateString() : 'N/A'}</p>
        </div>

        {food.additionalNotes && (
          <p className="text-sm text-gray-500 mb-2 flex-grow min-h-[2rem] max-h-8 overflow-hidden" title={food.additionalNotes}> {/* Reduced min-h and max-h */}
             <span className="font-medium">Notes:</span> {food.additionalNotes.length > 40 ? `${food.additionalNotes.substring(0, 40)}...` : food.additionalNotes} {/* Adjusted substring length */}
          </p>
        )}
         {!food.additionalNotes && <div className="flex-grow min-h-[2rem]"></div>} 


        <div className="card-actions justify-end mt-auto"> 
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

const HomePage = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const { data: allAvailableFoods = [], isLoading: isLoadingFoods, error: foodsError } = useQuery({
    queryKey: ['homepageAvailableFoods'], 
    queryFn: fetchCoreFoodsData,
  });

  const featuredFoods = useMemo(() => {
    if (!allAvailableFoods || allAvailableFoods.length === 0) {
      return [];
    }
    
    const sortedByQuantity = [...allAvailableFoods].sort((a, b) => (b.foodQuantity || 0) - (a.foodQuantity || 0));
    return sortedByQuantity.slice(0, 6);
  }, [allAvailableFoods]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleViewDetails = (foodId) => {
    if (!user) {
      navigate("/login", { state: { from: `/food/${foodId}` } }); 
    } else {
      navigate(`/food/${foodId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        className="hero min-h-[60vh] bg-cover bg-center rounded-lg shadow-lg my-8"
        style={{ backgroundImage: "url('/banner.webp')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <motion.h1 
              className="mb-5 text-5xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Welcome to SharedSpoon
            </motion.h1>
            <motion.p 
              className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Connecting communities, reducing food waste, and sharing abundance. Find or offer food with ease.
            </motion.p>
            <Link to="/available-foods" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </motion.section>

      
      <section className="my-12">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
        >
          Featured Foods
        </motion.h2>
        {isLoadingFoods && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="card-body p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/6 mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {foodsError && (
          <div className="text-center text-red-500 py-10">
            <p>Could not load featured foods: {foodsError.message}</p>
          </div>
        )}
        {!isLoadingFoods && !foodsError && featuredFoods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFoods.map(food => (
              <FoodItemCard key={food._id} food={food} onNavigateToDetails={handleViewDetails} />
            ))}
          </div>
        )}
        {!isLoadingFoods && !foodsError && featuredFoods.length === 0 && (
           <p className="text-center text-xl text-gray-500 mt-10">No featured foods available at the moment.</p>
        )}
        <div className="text-center mt-8">
          <Link to="/available-foods" className="btn btn-secondary">
            Show All Foods
          </Link>
        </div>
      </section>

      
      <section className="my-12 p-8 bg-base-200 rounded-lg shadow">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <h3 className="text-xl font-semibold mb-2">1. Donate Food</h3>
            <p>Have surplus food? List it easily on our platform with details like quantity and pickup location.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <h3 className="text-xl font-semibold mb-2">2. Find Food</h3>
            <p>Browse available food items shared by others in your community. Filter by location or type.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }}>
            <h3 className="text-xl font-semibold mb-2">3. Connect & Share</h3>
            <p>Request food items you need, or coordinate pickup for donations. Reduce waste together!</p>
          </motion.div>
        </div>
      </section>

      
      <section className="my-12">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Our Community Impact
        </motion.h2>
        <div className="stats shadow stats-vertical lg:stats-horizontal w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div className="stat-title">Meals Shared</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">Helping families since 2023</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">Food Waste Reduced</div>
            <div className="stat-value text-secondary">12.8 Tons</div>
            <div className="stat-desc">Making our planet greener</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div className="stat-title">Active Donors</div>
            <div className="stat-value">1,200+</div>
            <div className="stat-desc">Growing community</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;