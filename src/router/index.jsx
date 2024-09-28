import { lazy } from "react";
import { useRoutes } from "react-router-dom";

const UsersView = lazy(() => import("../users/index"));
const UsersForm = lazy(() => import("../users/form"));

function Router() {
  const routes = [
    {
      path: "/users",
      element: <UsersView />,
    },
    {
      path: "/users/form",
      element: <UsersForm />,
    },
  ];

  return useRoutes(routes);
}

export default Router;