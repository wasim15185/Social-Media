import { apiClient } from "@/lib/network/api-client"

/**
 * Update profile (bio, name)
 */
export async function updateProfile(data: { bio?: string; name?: string }) {
  return apiClient.patch("/users/profile", data)
}

/**
 * Update avatar
 */
/**
 * Update avatar
 */
export async function updateAvatar(file: File) {
  const formData = new FormData()

  formData.append("avatar", file)

  return apiClient.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
/**
 * Update cover
 */
export async function updateCover(file: File) {
  const formData = new FormData()

  formData.append("cover", file)

  return apiClient.patch("/users/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}