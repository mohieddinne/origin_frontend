import axios from "axios";
import jwtService from "app/services/originServices/jwtService";

var instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    authorization: "Bearer " + jwtService.getAccessToken(),
  };
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }
);

instance.CancelToken = axios.CancelToken;

export default instance;
