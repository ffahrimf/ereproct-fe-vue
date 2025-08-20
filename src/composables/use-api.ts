import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import Cookies from "js-cookie";
import { useDecrypt, useEncrypt, addLang } from "./use-helper";

interface PostData {
  path: string;
  body: Record<string, any>;
}

class useApi {
  private instance: AxiosInstance;
  private lang: string;

  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_APP_ENV}/api`,
      headers: {
        Accept: "text/plain"
      }
    });
    this.lang = Cookies.get("lang") ?? "id-ID";

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useDecrypt(Cookies.get("hAS-aTH"));
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh")
        ) {
          originalRequest._retry = true;

          // Ambil refresh token dari cookies
          const refreshToken = useDecrypt(Cookies.get("hAS-rTH"));

          if (!refreshToken) {
            // Jika tidak ada refresh token, langsung logout
            Cookies.remove("hAS-aTH");
            Cookies.remove("hAS-rTH");
            window.location.href = "/auth/login";
            return Promise.reject(error);
          }

          try {
            // Kirim refresh token sebagai body mentah
            const refreshRes = await axios.post(
              `${import.meta.env.VITE_APP_ENV}/api/auth/refresh`,
              refreshToken, // Kirim string mentah, bukan objek
              {
                headers: {
                  "Content-Type": "application/json" // Tetap set content-type
                }
              }
            );

            //  Baca struktur respons yang benar
            const newAccessToken = refreshRes.data?.data?.token;
            const newRefreshToken = refreshRes.data?.data?.refresh_token;

            if (newAccessToken && newRefreshToken) {
              //  Simpan KEDUA token yang baru
              Cookies.set(
                "hAS-aTH",
                JSON.stringify(useEncrypt(newAccessToken)),
                { expires: 7 }
              );
              Cookies.set(
                "hAS-rTH",
                JSON.stringify(useEncrypt(newRefreshToken)),
                { expires: 30 }
              );

              // Update header request original dan ulangi request
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Jika refresh gagal (misal refresh token expired), hapus semua dan logout
            Cookies.remove("hAS-aTH");
            Cookies.remove("hAS-rTH");
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error?.response?.data ?? error);
      }
    );
  }

  async get(rawPath: string): Promise<any> {
    const path = addLang(rawPath, this.lang);
    const res = await this.instance.get(path);
    return res.data;
  }

  async post(data: PostData): Promise<any> {
    const path = addLang(data.path, this.lang);
    const res = await this.instance.post(path, data.body);
    return res.data;
  }

  async delete(path: string, body?: Record<string, any>): Promise<any> {
    const fullPath = addLang(path, this.lang);
    const res = await this.instance.delete(fullPath, {
      data: body
    });
    return res.data;
  }
}

export default useApi;
