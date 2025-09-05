import { put, list, del } from "@vercel/blob"

const token = process.env.BLOB_READ_WRITE_TOKEN

let isTokenMissing = false

if (!token) {
  console.warn("BLOB_READ_WRITE_TOKEN is not set. Using fallback local storage.")
  isTokenMissing = true
}

// Fallback functions
const fallbackUploadImage = async (file: File) => {
  const url = URL.createObjectURL(file)
  return url
}

const fallbackListImages = async () => []
const fallbackDeleteImage = async () => {}

// Use real or fallback functions based on token availability
export const uploadImage = isTokenMissing ? fallbackUploadImage : realUploadImage
export const listImages = isTokenMissing ? fallbackListImages : realListImages
export const deleteImage = isTokenMissing ? fallbackDeleteImage : realDeleteImage

async function realUploadImage(file: File) {
  try {
    const uniqueFilename = `${file.name.split(".")[0]}-${Date.now()}.${file.name.split(".").pop()}`
    const { url } = await put(uniqueFilename, file, {
      access: "public",
      token: token!,
      addRandomSuffix: false,
    })
    return url
  } catch (error) {
    console.error("Error uploading image:", error)
    return fallbackUploadImage(file)
  }
}

async function realListImages() {
  try {
    const { blobs } = await list({ token: token! })
    return blobs
  } catch (error) {
    console.error("Error listing images:", error)
    return []
  }
}

async function realDeleteImage(url: string) {
  try {
    await del(url, { token: token! })
  } catch (error) {
    console.error("Error deleting image:", error)
  }
}

