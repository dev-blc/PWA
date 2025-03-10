// needs server only because it uses node:child_process and that is not supported in the browser
import 'server-only'

import imageType from 'image-type'
import sharp from 'sharp'

export async function processImage(
    input: string | File | Buffer,
    width: number = 240,
    height: number = 240,
): Promise<Buffer> {
    try {
        let buffer: Buffer

        if (typeof input === 'string') {
            // Handle base64 string
            const base64Data = input.split(',')[1]
            buffer = Buffer.from(base64Data, 'base64')
        } else if (input instanceof File) {
            // Handle File object
            const arrayBuffer = await input.arrayBuffer()
            buffer = Buffer.from(arrayBuffer)
        } else if (Buffer.isBuffer(input)) {
            // Handle Buffer
            buffer = input
        } else {
            throw new Error('Invalid input type')
        }

        const resizedImageBuffer = await sharp(buffer)
            .resize(width, height, { fit: 'cover' })
            .png({ quality: 100 })
            .toBuffer()

        return resizedImageBuffer
    } catch (error) {
        throw new Error('Error processing image: ' + JSON.stringify(error))
    }
}

// Process the image in the server

export async function processImage2(base64String: string): Promise<{ buffer: Buffer; mimeType: string }> {
    // Extract the MIME type and base64 content
    const match = base64String.match(/^data:(.+);base64,(.*)$/)

    if (!match) {
        throw new Error('Invalid base64 string format')
    }

    const [, mimeType, base64Content] = match

    // Decode the base64 string to a buffer
    const buffer = Buffer.from(base64Content, 'base64')

    try {
        // Try to process the image with sharp
        const image = sharp(buffer)
        // const metadata = await image.metadata()

        // If sharp can read the image, return it without changes
        return { buffer: await image.toBuffer(), mimeType }
    } catch (error) {
        console.error('Error processing image with sharp:', error)

        // If the processing with sharp fails, try a more basic approach
        try {
            // Check if the buffer is a valid image
            const type = await imageType(buffer)

            if (type) {
                console.log('Image type detected:', type.mime)
                return { buffer, mimeType: type.mime }
            } else {
                throw new Error('Unable to determine image type')
            }
        } catch (basicError) {
            console.error('Error in basic image processing:', basicError)
            throw new Error('Unable to process image')
        }
    }
}
