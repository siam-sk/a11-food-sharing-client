import { Link } from "react-router";
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="relative isolate flex items-center justify-center min-h-[calc(100vh-200px)] bg-base-200 px-4">
    
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      animate={{ y: [0, 12, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.div
      className="relative text-center p-10 bg-base-100/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-base-content/10 max-w-md w-full"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-primary/10">
        <FaceFrownIcon className="h-12 w-12 text-primary" />
      </div>

      <h1 className="text-7xl font-extrabold tracking-tight text-primary">404</h1>
      <p className="mt-3 text-xl font-semibold text-base-content">Page not found</p>
      <p className="mt-2 text-base text-base-content/80">
        The page you’re looking for doesn’t exist or was moved.
      </p>

      <div className="mt-8 flex items-center justify-center">
        <Link to="/" className="btn btn-primary btn-wide">
          Go home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;