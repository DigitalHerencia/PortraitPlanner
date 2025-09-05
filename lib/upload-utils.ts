import { put } from "@vercel/blob"

export async function uploadToBlob(file: File) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set")
  }
  try {
    const response = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return `https://a5fvmmg873kgkibm.public.blob.vercel-storage.com/${response.url}`
  } catch (error) {
    console.error("Error uploading to blob storage:", error)
    throw error
  }
}

