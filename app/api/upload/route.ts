import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'sunrise-bookstore/covers', resource_type: 'image' },
        (error, result) => {
          if (error || !result) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        }
      ).end(buffer)
    })

    return Response.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
