import { useEffect } from "react";

import { EngineeringAPI } from "../../api/apiConfig";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google"

const ResponseGoogle = async (data) => {
  const _data = {
    token: data.credential,
  };
  const loginResponse = await EngineeringAPI.loginUser(_data);
  localStorage.setItem("token", loginResponse.data.data.token);
  if (localStorage.getItem("token")) {
    toast.success("Login Successfull");
  }

  setTimeout(() => {
    if (localStorage.getItem("token")) {
      document.location.href = "/";
    }
  }, 1500);
};

const failureCallback = (data) => {
  console.log(data);
  toast.error(`Error: ${data.details}`);
};

export const Login = (props) => {

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h1 className="login-title">Choose your Login Method</h1>
        <div className="google_login-btn">
          <GoogleLogin
            onSuccess={ResponseGoogle}
            onError={failureCallback}
            prompt={"consent"}
            theme={"filled_blue"}
            size="medium"
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};
