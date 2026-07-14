import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function getTotalStorageBytes(): Promise<number | null> {
  if (!process.env.CLOUDINARY_API_KEY) return null
  try {
    let totalBytes = 0
    let cursor: string | undefined
    do {
      const result: any = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'sunrise-bookstore',
        max_results: 500,
        next_cursor: cursor,
      })
      totalBytes += (result.resources ?? []).reduce((sum: number, r: any) => sum + (r.bytes ?? 0), 0)
      cursor = result.next_cursor
    } while (cursor)
    return totalBytes
  } catch {
    return null
  }
}

export default cloudinary
