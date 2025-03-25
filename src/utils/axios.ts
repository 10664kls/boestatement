import axios from "axios";
import { getTokenFromLocalStorage, setTokensToLocalStorage } from "./tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

api.interceptors.request.use(
  (config)=> {
    const accessToken = getTokenFromLocalStorage("accessToken")
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getTokenFromLocalStorage("refreshToken")
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await api.post("/v1/auth/token", {
          token: refreshToken,
        })

        if (response.status === 200) {
          const accessToken = response.data.accessToken
          const refreshToken = response.data.refreshToken
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          
          setTokensToLocalStorage(accessToken, refreshToken)
          return api(originalRequest);
        }

        return Promise.reject(error);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
)

export default api