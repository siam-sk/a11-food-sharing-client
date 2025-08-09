import { useState, useEffect, useMemo } from "react"; 
import { Link, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'; 
import HeroSlider from "../components/HeroSlider"; 
import { MapPinIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { apiGet } from '../lib/api';

const fetchCoreFoodsData = () => apiGet('/api/foods');


const FoodItemCard = ({ food, onNavigateToDetails }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow border border-base-300 hover:border-primary transition-all duration-300 group p-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      {/* Main image */}
      <figure className="relative h-52 w-full overflow-hidden">
        <img src={food.foodImage} alt={food.foodName} className="w-full h-full object-cover" />
        {food.isUrgent && (
          <div className="badge badge-error gap-1 absolute top-2 right-2 font-semibold text-white p-2 text-xs">
            URGENT
          </div>
        )}
      </figure>
      {/* Bottom row */}
      <div className="flex flex-row items-stretch justify-between p-4 gap-3">
        {/* Left: name + donor */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg truncate" title={food.foodName}>{food.foodName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img src={food.donatorImage || 'https://via.placeholder.com/40'} alt={food.donatorName || 'Donor'} />
              </div>
            </div>
            <span className="text-sm text-base-content/70 truncate" title={food.donatorName || 'Anonymous Donor'}>
              {food.donatorName || 'Anonymous Donor'}
            </span>
          </div>
        </div>
        {/* Right: location, expires, button */}
        <div className="flex flex-col items-end justify-between text-right gap-2">
          <div className="flex items-center gap-1 text-sm text-base-content/70">
            <MapPinIcon className="w-5 h-5" />
            <span className="truncate max-w-[7rem]" title={food.pickupLocation}>{food.pickupLocation}</span>
          </div>
          {/* <div className="flex items-center gap-1 text-sm text-base-content/70">
            <CalendarDaysIcon className="w-5 h-5" />
            <span>
              {food.expiredDateTime ? new Date(food.expiredDateTime).toLocaleDateString() : 'N/A'}
            </span>
          </div> */}
          <button
            onClick={() => onNavigateToDetails(food._id)}
            className="btn btn-primary btn-sm mt-2"
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
    return sortedByQuantity.slice(0, 8); 
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
      
      <HeroSlider />

      
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
                <div className="h-48 bg-base-300"></div>
                <div className="card-body p-4">
                  <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-base-300 rounded-full mr-2"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-base-300 rounded w-full mb-1"></div>
                  <div className="h-3 bg-base-300 rounded w-5/6 mb-1"></div>
                  <div className="h-3 bg-base-300 rounded w-4/6 mb-3"></div>
                  <div className="h-8 bg-base-300 rounded w-1/3 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {foodsError && (
          <div className="text-center text-error py-10">
            <p>Could not load featured foods: {foodsError.message}</p>
          </div>
        )}
        {!isLoadingFoods && !foodsError && featuredFoods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredFoods.map(food => (
              <FoodItemCard key={food._id} food={food} onNavigateToDetails={handleViewDetails} />
            ))}
          </div>
        )}
        {!isLoadingFoods && !foodsError && featuredFoods.length === 0 && (
           <div className="text-center py-10">
             <p className="text-center text-xl text-base-content/70 mt-10">No featured foods available at the moment.</p>
             <Link to="/add-food" className="btn btn-primary mt-4">Be the first to donate!</Link>
           </div>
        )}
        <div className="text-center mt-8">
          <Link to="/available-foods" className="btn btn-secondary">
            Show All Foods
          </Link>
        </div>
      </section>

      
      <section className="my-12 p-8 bg-base-100 rounded-lg shadow">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <h3 className="text-xl font-semibold mb-2">1. Donate Food</h3>
            <p className="text-base-content/80">Have surplus food? List it easily on our platform with details like quantity and pickup location.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="flex flex-col items-center">
            <div className="bg-secondary/10 p-4 rounded-full mb-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
            <h3 className="text-xl font-semibold mb-2">2. Find Food</h3>
            <p className="text-base-content/80">Browse available food items shared by others in your community. Filter by location or type.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }} className="flex flex-col items-center">
            <div className="bg-accent/10 p-4 rounded-full mb-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 3.8z" /></svg></div>
            <h3 className="text-xl font-semibold mb-2">3. Connect & Share</h3>
            <p className="text-base-content/80">Request food items you need, or coordinate pickup for donations. Reduce waste together!</p>
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

      
      <section className="my-12 py-16 bg-base-100 rounded-lg shadow-inner">
        <motion.div
          className="container mx-auto text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-primary-focus mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-base-content/80 max-w-2xl mx-auto mb-8">
            Get the latest updates on new food listings, community stories, and tips on reducing food waste delivered right to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;