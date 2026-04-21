import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

let accessToken = "";

export function setAccessToken(newToken: string): void {
  accessToken = newToken;
}

type CustomAxiosRequestConfig = {
  sent?: boolean;
} & InternalAxiosRequestConfig;

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization ??= `Bearer ${accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config: CustomAxiosRequestConfig }) => {
    const prev = error.config;
    if (error.status === 403 && !prev.sent) {
      prev.sent = true;
      const response: AxiosResponse<{ accessToken: string }> =
        await axiosInstance.get("/auth/refresh");
      setAccessToken(response.data.accessToken);
      prev.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(prev);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
