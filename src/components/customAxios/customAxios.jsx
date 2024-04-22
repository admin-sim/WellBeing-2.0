import { notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function navigate401(navigate) {
  navigate("/login");
}

const customAxios = axios.create({
  // Define default headers here
  headers: {
    "Content-Type": "application/json", // Add other default headers as needed
  },
});

// Add an interceptor to set the Authorization header if a token is available
customAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => {
    // If the response is OK, return it
    return response;
  },
  (error) => {
    // If the response indicates that the token has expired...
    if (error.response.status === 401) {
      console.log("401...");
      
      const navigate = useNavigate();
      navigate401(navigate); // Call navigate401 and pass the navigate function
    }
    if (error.response.status === 403) {
      notification.error({
        message: "Error",
        description: "Your Role Does not have access.",
        placement: "top",
      });
      return false;
    }
    if (error.response.status === 500) {
      notification.error({
        message: "Error",
        description: "An Internal server Error Occurred.",
        placement: "top",
      });
      return false;
    }
    // If the response indicates another kind of error, reject the promise with the error object
    return Promise.reject(error);
  }
);

export default customAxios;
