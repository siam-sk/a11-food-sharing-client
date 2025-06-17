import { Link } from "react-router";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-6xl font-bold text-sky-600 mb-4">404</h1>
    <p className="text-2xl text-gray-700 mb-6">Page Not Found</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound;