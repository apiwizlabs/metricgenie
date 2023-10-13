import jwtDecode from "jwt-decode";

export const getLoggedInUser = () => {
  return jwtDecode(localStorage.getItem("token"));
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
