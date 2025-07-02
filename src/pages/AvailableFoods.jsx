import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase.init";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon, ArrowsUpDownIcon, ViewColumnsIcon, TableCellsIcon, CalendarDaysIcon, ExclamationTriangleIcon, CubeIcon, MapPinIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const FoodItemCard = ({ food, onNavigateToDetails }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl overflow-hidden flex flex-col h-full border border-base-300 hover:border-primary transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <figure className="relative h-48 flex-shrink-0">
        <img src={food.foodImage} alt={food.foodName} className="w-full h-full object-cover" />
        {food.isUrgent && (
          <div className="badge badge-error gap-1 absolute top-2 right-2 font-semibold text-white p-2 text-xs">
            URGENT
          </div>
        )}
      </figure>
      <div className="card-body p-4 flex flex-col flex-grow">
        <h2 className="card-title text-lg font-bold mb-2 truncate" title={food.foodName}>
          {food.foodName}
        </h2>
        
        <div className="flex items-center mb-3">
          <div className="avatar mr-2">
            <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src={food.donatorImage || 'https://via.placeholder.com/40'} alt={food.donatorName || 'Donor'} />
            </div>
          </div>
          <span className="text-sm text-base-content/80 truncate" title={food.donatorName || 'Anonymous Donor'}>
            {food.donatorName || 'Anonymous Donor'}
          </span>
        </div>

        
        <div className="space-y-2 text-sm text-base-content mb-4">
          <div className="flex items-center" title={`Quantity: ${food.foodQuantity}`}>
            <CubeIcon className="w-4 h-4 mr-2 flex-shrink-0 text-base-content/60" />
            <span>Serves: <strong>{food.foodQuantity}</strong></span>
          </div>
          <div className="flex items-center" title={`Location: ${food.pickupLocation}`}>
            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-base-content/60" />
            <span className="truncate">{food.pickupLocation}</span>
          </div>
          <div className="flex items-center" title={`Expires: ${new Date(food.expiredDate).toLocaleDateString()}`}>
            <CalendarDaysIcon className="w-4 h-4 mr-2 flex-shrink-0 text-base-content/60" />
            <span>Expires: <strong>{food.expiredDate ? new Date(food.expiredDate).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
        </div>

        {food.additionalNotes && (
          <p className="text-sm text-base-content/70 mb-4 flex-grow min-h-[2.5rem]" title={food.additionalNotes}>
             {food.additionalNotes.length > 60 ? `${food.additionalNotes.substring(0, 60)}...` : food.additionalNotes}
          </p>
        )}
         {!food.additionalNotes && <div className="flex-grow min-h-[2.5rem]"></div>}

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


const fetchAvailableFoods = async () => {
  const response = await fetch('https://a11-food-sharing-server-three.vercel.app/api/foods');
  if (!response.ok) {
    throw new Error('Network response was not ok while fetching available foods');
  }
  return response.json();
};

const AvailableFoods = () => {
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [columnLayout, setColumnLayout] = useState(3);

  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const { data: allFoods = [], isLoading, error } = useQuery({
    queryKey: ['allAvailableFoods'],
    queryFn: fetchAvailableFoods,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const displayedFoods = useMemo(() => {
    let foodsToProcess = [...allFoods];

    if (searchTerm) {
      foodsToProcess = foodsToProcess.filter(food =>
        food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder !== "default") {
      foodsToProcess.sort((a, b) => {
        const dateA = new Date(a.expiredDate);
        const dateB = new Date(b.expiredDate);
        if (sortOrder === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }
    return foodsToProcess;
  }, [allFoods, sortOrder, searchTerm]);

  const handleSortChange = (newOrder) => {
    setSortOrder(currentOrder => currentOrder === newOrder ? "default" : newOrder);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleLayout = () => {
    setColumnLayout(prev => {
      if (prev === 2) return 3;
      if (prev === 3) return 4;
      return 2; 
    });
  };

  const handleViewDetails = (foodId) => {
    if (!user) {
      navigate("/login", { state: { from: `/food/${foodId}` } });
    } else {
      navigate(`/food/${foodId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-10 px-4">
        <span className="loading loading-spinner loading-lg text-sky-600"></span>
        <p className="mt-4 text-lg text-gray-700">Loading available foods...</p>
      </div>
    );
  }

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
        <CalendarDaysIcon className="mx-auto h-16 w-auto text-primary" />
        <h1 className="mt-4 text-4xl font-extrabold text-base-content sm:text-5xl">
          Available Foods
        </h1>
        <p className="mt-3 text-lg text-base-content/80">
          Browse food items shared by our community.
        </p>
      </div>

      <div className="mb-8 p-4 sm:p-6 bg-base-100 shadow-xl rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="searchFood" className="block text-sm font-medium text-base-content mb-1">
              Search by Food Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-base-content/40" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="searchFood"
                placeholder="E.g., Apples, Bread"
                className="input input-bordered w-full pl-10 py-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-base-content self-center">Sort by Expire Date:</span>
              <button
                onClick={() => handleSortChange('asc')}
                className={`btn btn-sm ${sortOrder === 'asc' ? 'btn-primary' : 'btn-outline'}`}
                title="Sort by nearest expiry date"
              >
                <ArrowsUpDownIcon className="h-4 w-4 mr-1 inline-block transform rotate-180" /> Nearest
              </button>
              <button
                onClick={() => handleSortChange('desc')}
                className={`btn btn-sm ${sortOrder === 'desc' ? 'btn-primary' : 'btn-outline'}`}
                title="Sort by furthest expiry date"
              >
                <ArrowsUpDownIcon className="h-4 w-4 mr-1 inline-block" /> Furthest
              </button>
            </div>
            <button
                onClick={toggleLayout}
                className="btn btn-sm btn-outline"
                title={`Switch to ${columnLayout === 2 ? 3 : columnLayout === 3 ? 4 : 2} Columns`}
            >
                {columnLayout === 2 && <ViewColumnsIcon className="h-5 w-5" />}
                {columnLayout === 3 && <TableCellsIcon className="h-5 w-5" />}
                {columnLayout === 4 && <Squares2X2Icon className="h-5 w-5" />}
                <span className="ml-2 hidden sm:inline">{columnLayout} Cols</span>
            </button>
          </div>
        </div>
      </div>

      {displayedFoods.length > 0 ? (
        <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 ${columnLayout === 3 ? 'lg:grid-cols-3' : ''} ${columnLayout === 4 ? 'lg:grid-cols-4' : ''}`}>
          {displayedFoods.map(food => (
            <FoodItemCard key={food._id} food={food} onNavigateToDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-base-content/40 mb-4" />
          <p className="text-xl text-base-content/80">
            {searchTerm ? "No food items match your search." : "No food items currently available."}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="mt-4 btn btn-sm btn-link">
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableFoods;