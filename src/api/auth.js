import axios from "./api";

export const login = (memberId, password) => axios.post("/auth/login", { memberId, password });

export const logout = () => axios.post("/auth/logout");