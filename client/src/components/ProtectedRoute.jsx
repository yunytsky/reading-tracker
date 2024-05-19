import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
    const {user} = useContext(AuthContext);

    return (
      <>
        {user && user.verified ? (
          <Outlet />
        ) : user && !user.verified ? (
          <Navigate to={"/account-verification"} />
        ) : (
          <Navigate to={"/login"} />
        )}
      </>
    );
};

export default ProtectedRoute;