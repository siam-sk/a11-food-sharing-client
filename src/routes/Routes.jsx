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
import MyFoodRequests from "../pages/MyFoodRequests";
import NotFound from "../pages/NotFound";
import TitleRoute from "../components/TitleRoute";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PublicOnlyRoute from "../components/PublicOnlyRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: (
          <TitleRoute title="Home">
            <HomePage />
          </TitleRoute>
        ),
      },
      {
        path: "available-foods",
        element: (
          <TitleRoute title="Available Foods">
            <AvailableFoods />
          </TitleRoute>
        ),
      },
      {
        path: "/add-food",
        element: (
          <PrivateRoute>
            <TitleRoute title="Add Food">
              <AddFood />
            </TitleRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-my-foods",
        element: (
          <PrivateRoute>
            <TitleRoute title="Manage My Foods">
              <ManageMyFoods />
            </TitleRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-food-requests",
        element: (
          <PrivateRoute>
            <TitleRoute title="My Food Requests">
              <MyFoodRequests />
            </TitleRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: (
          <TitleRoute title="Login">
            <Login />
          </TitleRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <TitleRoute title="Register">
            <Register />
          </TitleRoute>
        ),
      },
      {
        path: "/food/:foodId",
        element: (
          <TitleRoute title="Food Details">
            <SingleFoodDetailsPage />
          </TitleRoute>
        ),
      },
      {
        path: "about",
        element: (
          <PublicOnlyRoute>
            <TitleRoute title="About">
              <About />
            </TitleRoute>
          </PublicOnlyRoute>
        ),
      },
      {
        path: "contact",
        element: (
          <PublicOnlyRoute>
            <TitleRoute title="Contact">
              <Contact />
            </TitleRoute>
          </PublicOnlyRoute>
        ),
      },
      {
        path: "*",
        element: (
          <TitleRoute title="404 Not Found">
            <NotFound />
          </TitleRoute>
        ),
      },
    ],
  },
]);

export default router;
