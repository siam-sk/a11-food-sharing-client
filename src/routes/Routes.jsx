import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout"; 
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";

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
        element: <div>Add Food Page</div>, 
      },
      {
        path: "manage-my-foods",
        element: <div>Manage My Foods Page</div>,
      },
      {
        path: "my-food-requests",
        element: <div>My Food Requests Page</div>, 
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
