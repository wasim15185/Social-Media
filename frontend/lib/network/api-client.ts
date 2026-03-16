import axios from "axios"

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Attach JWT token automatically
 */
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

/**
 * Central error handling
 */
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong"

    return Promise.reject(new Error(message))
  }
)
