import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = Cookies.get("token");

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    // "Content-Type": "application/json"
  },
});
