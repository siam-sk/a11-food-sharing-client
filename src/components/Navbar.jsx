import { Link } from "react-router"; 
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext"; 
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const auth = getAuth(app);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link to="/" className="hover:text-primary">Home</Link>
      </li>
      <li>
        <Link to="/available-foods" className="hover:text-primary">Available Foods</Link>
      </li>
      {!loading && !user && (
        <>
          <li>
            <Link to="/about" className="hover:text-primary">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </li>
        </>
      )}
      {!loading && user && (
        <>
          <li>
            <Link to="/add-food" className="hover:text-primary">Add Food</Link>
          </li>
          <li>
            <Link to="/manage-my-foods" className="hover:text-primary">Manage My Foods</Link>
          </li>
          <li>
            <Link to="/my-food-requests" className="hover:text-primary">My Food Requests</Link>
          </li>
        </>
      )}
    </>
  );

  const primaryButtonClass = "btn btn-sm btn-primary";
  const secondaryButtonClass = "btn btn-sm btn-secondary";
  const errorButtonClass = "btn btn-sm btn-error";

  const logoElement = (
    <Link to="/" className="flex items-center">
      <img src="/logo.png" alt="SharedSpoon Logo" className="h-8 lg:h-9 mr-0 lg:mr-2" />
      <div className="hidden lg:flex items-baseline">
        <span className="italic font-light text-base-content/80 text-2xl">Shared</span>
        <span className="font-bold text-primary text-2xl">Spoon</span>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className={`navbar bg-base-100 md:px-12 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="navbar-start">
          <div className="lg:hidden">
            <div className="btn btn-ghost btn-square animate-pulse bg-base-300"></div>
          </div>
          <div className="ml-2 lg:ml-0">
            {logoElement}
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end">
          <div className="w-24 h-8 bg-base-300 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`navbar bg-base-100 md:px-12 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden pr-0 hover:bg-base-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
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
      <div className="navbar-end space-x-2">
        {loading ? (
          <span className="loading loading-sm"></span>
        ) : !user ? (
          <>
            <Link to="/login" className={primaryButtonClass}>
              Login
            </Link>
            <Link to="/signup" className={`${secondaryButtonClass}`}>
              Signup
            </Link>
          </>
        ) : (
          <div className="flex items-center">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-base-200">
                <div className="w-10 rounded-full ring-1 ring-base-300">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="Profile"
                  />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                <li className="p-2 font-semibold border-b border-base-300">{user.displayName || 'User'}</li>
                <li><Link to="/manage-my-foods">Manage My Foods</Link></li>
                <li><Link to="/my-food-requests">My Food Requests</Link></li>
                <li><Link to="/add-food">Add Food</Link></li>
              </ul>
            </div>
            <button onClick={handleLogout} className={`${errorButtonClass} ml-2`}>
              Logout
            </button>
          </div>
        )}

        
        
        <label className="relative inline-flex items-center cursor-pointer ml-2 pl-2 border-l border-base-300">
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === 'dark'}
            className="sr-only peer"
            aria-label="Toggle theme"
          />
          {/* Track */}
          <div className="w-14 h-7 rounded-full bg-primary/20 peer-checked:bg-base-content/20 transition-colors duration-300"></div>
          {/* Knob */}
          <div
            className="absolute top-0.5 left-[calc(0.5rem+2px)] w-6 h-6 rounded-full shadow-md
                       flex items-center justify-center
                       bg-yellow-500 peer-checked:bg-blue-400
                       transition-all duration-300 ease-in-out
                       peer-checked:translate-x-full"
          >
            
            <SunIcon className={`h-4 w-4 text-white transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
            <MoonIcon className={`absolute h-4 w-4 text-white transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </label>
      </div>
    </div>
  );
};

export default Navbar;