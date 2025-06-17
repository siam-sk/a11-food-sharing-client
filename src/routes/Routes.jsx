import { createBrowserRouter } from "react-router";
import Navbar from "../components/Navbar";

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
        <div>Login Page</div>
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <div>Signup Page</div>
      </>
    ),
  },
]);

export default router;
