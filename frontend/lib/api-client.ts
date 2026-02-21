import { getSession } from "next-auth/react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retryOnRefresh?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAccessToken(): Promise<string | null> {
    const session = await getSession();

    if (session?.error === "RefreshAccessTokenError") {
      // Redirect to login if refresh token is invalid
      window.location.href = "/login";
      return null;
    }

    return session?.accessToken || null;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { skipAuth = false, retryOnRefresh = true, ...customConfig } = config;

    const headers = new Headers(customConfig.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Add authorization header if not skipped
    if (!skipAuth) {
      const token = await this.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const requestConfig: RequestInit = {
      ...customConfig,
      headers,
    };

    let response = await fetch(url, requestConfig);

    // Handle 401 - Token expired, retry after refresh
    if (response.status === 401 && !skipAuth && retryOnRefresh) {
      console.log("Token expired, refreshing session...");

      // Force session refresh by calling getSession again
      // NextAuth will automatically refresh the token via jwt callback
      await getSession();

      // Get new token and retry request
      const newToken = await this.getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(url, {
          ...requestConfig,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as any;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(BACKEND_URL);

// Usage examples:
// const user = await apiClient.get<User>('/users/me');
// const result = await apiClient.post<CreateResult>('/posts', { title: 'Hello' });
// Public endpoint: await apiClient.get('/public/data', { skipAuth: true });
