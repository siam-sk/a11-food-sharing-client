import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully.");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
        toast.error("Logout failed: " + error.message);
      });
  };

  const navLinks = (
    <>
      <li>
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
      </li>
      <li>
        <Link to="/available-foods" className="text-gray-700 hover:text-blue-600">Available Foods</Link>
      </li>
      {!loading && user && (
        <>
          <li>
            <Link to="/add-food" className="text-gray-700 hover:text-blue-600">Add Food</Link>
          </li>
          <li>
            <Link to="/manage-my-foods" className="text-gray-700 hover:text-blue-600">Manage My Foods</Link>
          </li>
          <li>
            <Link to="/my-food-requests" className="text-gray-700 hover:text-blue-600">My Food Requests</Link>
          </li>
        </>
      )}
    </>
  );

  const primaryButtonClass = "btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none";
  const secondaryButtonClass = "btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300";
  const errorButtonClass = "btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none";

  const logoElement = (
    <Link to="/" className="flex items-center">
      <img src="/logo.png" alt="SharedSpoon Logo" className="h-8 lg:h-9 mr-0 lg:mr-2" />
      <div className="hidden lg:flex items-baseline">
        <span className="italic font-light text-gray-600 text-2xl">Shared</span>
        <span className="font-bold text-blue-700 text-2xl">Spoon</span>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="navbar bg-white shadow-md md:px-12">
        <div className="navbar-start">
          <div className="lg:hidden">
            <div className="btn btn-ghost btn-square animate-pulse bg-gray-200"></div>
          </div>
          <div className="ml-2 lg:ml-0">
            {logoElement}
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end">
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-white shadow-md md:px-12">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden pr-0 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 border border-gray-200">
            {navLinks}
          </ul>
        </div>
        <div className="ml-2 lg:ml-0">
         {logoElement}
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-1">
          {navLinks}
        </ul>
      </div>
      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-sm"></span>
        ) : !user ? (
          <>
            <Link to="/login" className={primaryButtonClass}>
              Login
            </Link>
            <Link to="/signup" className={`${secondaryButtonClass} ml-2`}>
              Signup
            </Link>
          </>
        ) : (
          <div className="flex items-center">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-gray-100">
                <div className="w-10 rounded-full ring-1 ring-gray-300">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="Profile"
                  />
                </div>
              </label>
            </div>
            <button onClick={handleLogout} className={`${errorButtonClass} ml-2`}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;