import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:3000/api/v1";
const token = Cookies.get("token");

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    // "Content-Type": "application/json"
  },
});
