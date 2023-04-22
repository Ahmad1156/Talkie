import axios from "axios";
import { ChatState } from "../Context/chatProvider";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
