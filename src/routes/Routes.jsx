import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import AddFood from "../pages/AddFood";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "available-foods",
        element: <div>Available Foods Page</div>,
      },
      {
        path: "add-food",
        element: (
          <PrivateRoute>
            <AddFood />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-my-foods",
        element: (
          <PrivateRoute>
            <div>Manage My Foods Page</div>
          </PrivateRoute>
        ),
      },
      {
        path: "my-food-requests",
        element: (
          <PrivateRoute>
            <div>My Food Requests Page</div>
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      
    ],
  },
]);

export default router;
