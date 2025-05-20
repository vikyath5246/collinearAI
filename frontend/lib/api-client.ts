type RequestOptions = {
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...customHeaders,
    })

    // Add auth token if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      headers.append("Authorization", `Bearer ${token}`)
    }

    return headers
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(options.headers),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "An error occurred")
    }

    return response.json()
  }

  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const headers = options.headers || {}
    const contentType = headers["Content-Type"] || "application/json"

    const body = contentType === "application/json" ? JSON.stringify(data) : data

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(headers),
      body,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "An error occurred")
    }

    return response.json()
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(options.headers),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "An error occurred")
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }
}

// Create an instance with the backend URL
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
