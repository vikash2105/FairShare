import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/App.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GroupDetails from "./pages/GroupDetails.jsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "groups/:id", element: <GroupDetails /> },
    ]
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
