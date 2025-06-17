import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebase.init";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhotoIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const navigate = useNavigate();

  const getCustomAuthToken = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('http://localhost:3000/api/auth/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error from token endpoint' }));
        throw new Error(errorData.message || 'Failed to get custom auth token');
      }

      const data = await response.json();
      if (data.authToken) {
        localStorage.setItem('authToken', data.authToken);
        console.log('Custom auth token stored after registration.');
      } else {
        throw new Error('Auth token not found in server response');
      }
    } catch (error) {
      console.error("Error getting or storing custom auth token during registration:", error);
      toast.error(`Token exchange failed: ${error.message}. Please try logging in.`);
      localStorage.removeItem('authToken');
    }
  };

  const validatePassword = (passwordToValidate) => {
    if (passwordToValidate.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(passwordToValidate)) {
      toast.error("Password must contain an uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(passwordToValidate)) {
      toast.error("Password must contain a lowercase letter.");
      return false;
    }
    
    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name.trim()) {
        toast.error("Name is required.");
        return;
    }
    if (!email.trim()) {
        toast.error("Email is required.");
        return;
    }
    if (!validatePassword(password)) {
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          await updateProfile(user, {
            displayName: name,
            photoURL: photoURL, 
          });
          toast.success("Registration successful! Profile updated.");
          await getCustomAuthToken(user);
          navigate("/"); 
        } catch (profileError) {
          toast.error("Failed to update profile: " + profileError.message);
          
          await getCustomAuthToken(user);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          toast.error("This email is already registered. Please login or use a different email.");
        } else {
          toast.error("Registration failed: " + error.message);
        }
        localStorage.removeItem('authToken');
      });
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <UserPlusIcon className="mx-auto h-16 w-auto text-sky-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
            sign in if you already have an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">
                Photo URL (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhotoIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="url"
                  id="photoURL"
                  name="photoURL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  autoComplete="photo"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
               <p className="mt-2 text-xs text-gray-500">
                Must be at least 6 characters, including an uppercase and a lowercase letter.
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;