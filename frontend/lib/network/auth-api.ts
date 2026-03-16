import { apiClient } from "./api-client"

export const AuthAPI = {
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post("/auth/login", data)

    return res.data
  },

  register: async (data: {
    name: string
    username: string
    email: string
    password: string
  }) => {
    const res = await apiClient.post("/auth/register", data)

    return res.data
  },
}
