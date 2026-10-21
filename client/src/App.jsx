import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/properties", element: <Properties /> },
      { path: "/properties/:id", element: <PropertyDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/listings", element: <MyListings /> },
          { path: "/dashboard/properties/new", element: <AddProperty /> },
          { path: "/dashboard/properties/:id/edit", element: <EditProperty /> },
        ],
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [{ path: "*", element: <NotFound /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
