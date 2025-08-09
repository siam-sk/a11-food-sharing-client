import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, ArrowsUpDownIcon, ViewColumnsIcon, TableCellsIcon, CalendarDaysIcon, ExclamationTriangleIcon, CubeIcon, MapPinIcon, Squares2X2Icon, FunnelIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/outline';
import { apiGet } from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import FoodCardSkeleton from '../components/FoodCardSkeleton';

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
      <div className="flex flex-row items-stretch justify-between p-3 gap-2">
        {/* Left: name + donor */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-base truncate" title={food.foodName}>{food.foodName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-7 h-7 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img src={food.donatorImage || 'https://via.placeholder.com/40'} alt={food.donatorName || 'Donor'} />
              </div>
            </div>
            <span className="text-xs text-base-content/70 truncate" title={food.donatorName || 'Anonymous Donor'}>
              {food.donatorName || 'Anonymous Donor'}
            </span>
          </div>
        </div>
        {/* Right: location, expires, button */}
        <div className="flex flex-col items-end justify-between text-right gap-1">
          <div className="flex items-center gap-1 text-xs text-base-content/70">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate max-w-[7rem]" title={food.pickupLocation}>{food.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-base-content/70">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>
              {food.expiredDate ? new Date(food.expiredDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <button
            onClick={() => onNavigateToDetails(food._id)}
            className="btn btn-primary btn-xs mt-1"
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const AvailableFoods = () => {
  // Expanded state for new filters and sorting
  const [filters, setFilters] = useState({
    searchTerm: "",
    showUrgentOnly: false,
    status: 'available', // Default to available
  });
  const [sortBy, setSortBy] = useState('newest'); // Default sort
  const debouncedSearch = useDebounce(filters.searchTerm, 300);
  const [columnLayout, setColumnLayout] = useState(3);

  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const { data: allFoods = [], isLoading, error } = useQuery({
    queryKey: ['foods', 'list'],
    queryFn: () => apiGet('/api/foods'), // Fetch all foods
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const displayedFoods = useMemo(() => {
    let foodsToProcess = [...allFoods];

    // Apply filters
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      foodsToProcess = foodsToProcess.filter(f =>
        f.foodName?.toLowerCase().includes(q) ||
        f.donatorName?.toLowerCase().includes(q)
      );
    }

    if (filters.showUrgentOnly) {
      foodsToProcess = foodsToProcess.filter(f => f.isUrgent);
    }
    
    if (filters.status) {
      foodsToProcess = foodsToProcess.filter(f => f.foodStatus === filters.status);
    }

    // Apply sorting
    foodsToProcess.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'urgent':
          return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0) || new Date(a.expiredDate) - new Date(b.expiredDate);
        case 'quantity':
          return b.foodQuantity - a.foodQuantity;
        case 'expiry_asc':
          return new Date(a.expiredDate) - new Date(b.expiredDate);
        default:
          return 0;
      }
    });

    return foodsToProcess;
  }, [allFoods, debouncedSearch, filters, sortBy]);

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const handleViewDetails = (foodId) => {
    if (!user) {
      navigate("/login", { state: { from: `/food/${foodId}` } });
    } else {
      navigate(`/food/${foodId}`);
    }
  };
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-10 px-4 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-error mb-4" />
        <p className="text-xl text-error-content">Error fetching foods: {error.message}</p>
        <p className="text-base-content/80 mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl">Available Foods</h1>
        <p className="mt-3 text-lg text-base-content/80">Browse food items shared by our community.</p>
      </div>

      <div className="mb-8 p-4 sm:p-6 bg-base-100 shadow-xl rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-base-content mb-1">Search by Food or Donor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                placeholder="E.g., Apples, Bread, John Doe"
                className="input input-bordered w-full pl-10"
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Sort Select */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-base-content mb-1">Sort By</label>
            <select name="sortBy" id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select select-bordered w-full">
              <option value="newest">Newest First</option>
              <option value="urgent">Most Urgent</option>
              <option value="quantity">Highest Quantity</option>
              <option value="expiry_asc">Expiring Soonest</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col gap-2">
             <label className="block text-sm font-medium text-base-content mb-1">Filters</label>
             <div className="form-control">
                <label className="cursor-pointer label justify-start gap-2 p-0">
                  <input type="checkbox" name="showUrgentOnly" checked={filters.showUrgentOnly} onChange={handleFilterChange} className="checkbox checkbox-warning" />
                  <span className="label-text flex items-center gap-1"><FireIcon className="h-4 w-4"/> Urgent Only</span>
                </label>
              </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      ) : displayedFoods.length > 0 ? (
        <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4`}>
          {displayedFoods.map(food => (
            <FoodItemCard key={food._id} food={food} onNavigateToDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-base-content/40 mb-4" />
          <p className="text-xl text-base-content/80">No food items match your current filters.</p>
          <button onClick={() => setFilters({ searchTerm: "", showUrgentOnly: false, status: 'available' })} className="mt-4 btn btn-sm btn-link">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableFoods;