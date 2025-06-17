import { createBrowserRouter } from "react-router";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Register from "../pages/Register"; // Add this import

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <div>Home Page</div>
      </>
    ),
  },
  {
    path: "/available-foods",
    element: (
      <>
        <Navbar />
        <div>Available Foods Page</div>
      </>
    ),
  },
  {
    path: "/add-food",
    element: (
      <>
        <Navbar />
        <div>Add Food Page</div>
      </>
    ),
  },
  {
    path: "/manage-my-foods",
    element: (
      <>
        <Navbar />
        <div>Manage My Foods Page</div>
      </>
    ),
  },
  {
    path: "/my-food-requests",
    element: (
      <>
        <Navbar />
        <div>My Food Requests Page</div>
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Register /> {/* Change this line */}
      </>
    ),
  },
]);

export default router;
