import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomeView from "../views/HomeView";
import RecipeDetailView from "../views/RecipeDetailView";

const router = createHashRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "/recipe/:category/:recipe",
    element: <RecipeDetailView />,
  },
]);

const AppRouter: React.FC = () => {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
};

export default AppRouter;
