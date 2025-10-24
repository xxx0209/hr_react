import api from "axios";
import { API_BASE_URL } from "../config/config";

const axios = api.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axios;