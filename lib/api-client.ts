import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE !== "false";

let refreshPromise: Promise<string | null> | null = null;

async function refreshTokenFlow(): Promise<string | null> {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newAccessToken = data?.data?.tokens?.accessToken;
    const newRefreshToken = data?.data?.tokens?.refreshToken;

    if (newAccessToken) {
      const isSecure = process.env.NODE_ENV === "production";
      Cookies.set("accessToken", newAccessToken, { secure: isSecure, sameSite: "strict", expires: 7 });
      if (newRefreshToken) {
        Cookies.set("refreshToken", newRefreshToken, { secure: isSecure, sameSite: "strict", expires: 30 });
      }
      return newAccessToken;
    }
  } catch (e) {
    console.error("Failed to refresh token", e);
  }
  return null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = Cookies.get("accessToken");

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, { ...options, headers });

    const isAuthFlow =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/verify") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password");

    if (response.status === 401 && !isRetry && !isAuthFlow) {
      if (!refreshPromise) {
        refreshPromise = refreshTokenFlow().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        const newHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        const retryResponse = await fetch(url, { ...options, headers: newHeaders });
        return processResponse<T>(retryResponse);
      } else {
        if (typeof window !== "undefined") {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("userRole");
          window.location.href = "/auth/login";
        }
        throw new Error("Session expired. Please log in again.");
      }
    }

    return processResponse<T>(response);
  } catch (error) {
    console.error("API client error:", error);
    throw error;
  }
}

async function processResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `Request failed with status ${response.status}` };
    }
    const errorMessage = errorData.error || errorData.message || response.statusText;
    const err = new Error(errorMessage) as any;
    err.status = response.status;
    err.code = errorData?.code;
    err.error = errorData?.error;
    err.details = errorData?.details;
    throw err;
  }

  if (response.status === 204) return {} as T;
  return await response.json();
}

export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body: any, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: any, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string, body?: any, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "DELETE", ...(body ? { body: JSON.stringify(body) } : {}) }),
  upload: <T>(url: string, formData: FormData, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "POST", body: formData }),
};

export { MOCK_MODE };
