import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";

const mockFoods = [
  { id: '1', foodName: 'Fresh Apples', foodImage: 'https://via.placeholder.com/300x200?text=Apples', quantity: 50, pickupLocation: 'Green Farm', donatorName: 'Alice Wonderland', expiredDateTime: '2025-06-25', additionalNotes: 'Organic Gala Apples' },
  { id: '2', foodName: 'Homemade Bread', foodImage: 'https://via.placeholder.com/300x200?text=Bread', quantity: 30, pickupLocation: 'Local Bakery', donatorName: 'Bob The Baker', expiredDateTime: '2025-06-22', additionalNotes: 'Sourdough, freshly baked' },
  { id: '3', foodName: 'Vegetable Mix', foodImage: 'https://via.placeholder.com/300x200?text=Veggies', quantity: 45, pickupLocation: 'Community Garden', donatorName: 'Charlie Garden', expiredDateTime: '2025-06-23', additionalNotes: 'Assorted seasonal vegetables' },
  { id: '4', foodName: 'Pasta Packets', foodImage: 'https://via.placeholder.com/300x200?text=Pasta', quantity: 60, pickupLocation: 'SuperMart Storage', donatorName: 'Diana StoreManager', expiredDateTime: '2025-12-31', additionalNotes: 'Various types of pasta' },
  { id: '5', foodName: 'Canned Soup', foodImage: 'https://via.placeholder.com/300x200?text=Soup', quantity: 55, pickupLocation: 'Food Bank', donatorName: 'Edward Helper', expiredDateTime: '2026-05-10', additionalNotes: 'Tomato and Chicken Noodle' },
  { id: '6', foodName: 'Rice Bags', foodImage: 'https://via.placeholder.com/300x200?text=Rice', quantity: 70, pickupLocation: 'Warehouse GoodDeeds', donatorName: 'Fiona Giver', expiredDateTime: '2027-01-01', additionalNotes: '5kg Basmati Rice bags' },
  { id: '7', foodName: 'Milk Cartons', foodImage: 'https://via.placeholder.com/300x200?text=Milk', quantity: 25, pickupLocation: 'Dairy Farm Outlet', donatorName: 'Gary Farmer', expiredDateTime: '2025-06-28', additionalNotes: 'Whole milk, 1 liter cartons' },
];

const FoodItemCard = ({ food, onNavigateToDetails }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <figure><img src={food.foodImage} alt={food.foodName} className="h-48 w-full object-cover" /></figure>
      <div className="card-body">
        <h2 className="card-title">{food.foodName}</h2>
        <p>Quantity: {food.quantity}</p>
        <p>Pickup: {food.pickupLocation}</p>
        <p>Expires: {new Date(food.expiredDateTime).toLocaleDateString()}</p>
        <p>Donator: {food.donatorName}</p>
        {food.additionalNotes && <p className="text-sm text-gray-600">Notes: {food.additionalNotes}</p>}
        <div className="card-actions justify-end">
          <button
            onClick={() => onNavigateToDetails(food.id)}
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
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    
    const sortedFoods = [...mockFoods].sort((a, b) => b.quantity - a.quantity);
    setFeaturedFoods(sortedFoods.slice(0, 6));
  }, []);

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
        // style={{ backgroundImage: "url('https://via.placeholder.com/1200x400?text=Delicious+Food+Sharing')" }}
        style={{ backgroundImage: "url('/hero-banner.jpg')" }} // Assuming you add a local image
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
            </motion.h1> {/* Updated Name */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFoods.map(food => (
            <FoodItemCard key={food.id} food={food} onNavigateToDetails={handleViewDetails} />
          ))}
        </div>
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
          animate={{ scale: 1, opacity: 1 }}
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