import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import AddFood from "../pages/AddFood";
import PrivateRoute from "../components/PrivateRoute";
import AvailableFoods from "../pages/AvailableFoods";
import SingleFoodDetailsPage from "../pages/SingleFoodDetailsPage";
import ManageMyFoods from "../pages/ManageMyFoods";

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
        element: <AvailableFoods />,
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
            <ManageMyFoods />
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
      {
        path: "food/:foodId",
        element: <SingleFoodDetailsPage />,
      },
    ],
  },
]);

export default router;
