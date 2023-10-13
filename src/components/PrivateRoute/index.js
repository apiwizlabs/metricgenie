import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");


  return children
  /*
  return token && jwt_decode(token).exp * 1000 > Date.now() ? (
    children
  ) : (
    <Navigate to={"/login"} replace />
  );
  */
};
