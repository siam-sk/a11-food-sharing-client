import { Link } from "react-router"; 
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../../firebase.init";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-2xl">
          <span className="text-primary">Food</span><span className="text-secondary">Share</span> {/* Example styling */}
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/available-foods">Available Foods</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/add-food">Add Food</Link>
              </li>
              <li>
                <Link to="/manage-my-foods">Manage My Foods</Link>
              </li>
              <li>
                <Link to="/my-food-requests">My Food Requests</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-sm ml-2">
              Signup
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="Profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={handleLogout} className="btn btn-error btn-sm">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;