import { Link } from "react-router";
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-base-200 px-4">
    <motion.div 
      className="text-center p-8 bg-base-100 rounded-2xl shadow-xl max-w-md w-full"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FaceFrownIcon className="mx-auto h-24 w-24 text-primary mb-4" />
      
      <h1 className="text-8xl font-extrabold text-primary tracking-tighter">
        404
      </h1>
      
      <p className="text-2xl font-semibold text-base-content mt-2 mb-4">
        Oops! Page Not Found
      </p>
      
      <p className="text-base-content/80 mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to="/" className="btn btn-primary btn-wide">
        Go Back Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;