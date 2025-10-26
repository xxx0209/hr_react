import axios from "./api";

export const getCurrentUser = () => axios.get("/user/me");