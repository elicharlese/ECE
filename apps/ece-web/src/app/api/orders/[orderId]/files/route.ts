import { NextRequest, NextResponse } from 'next/server'

// Mock file storage - in production, use cloud storage (AWS S3, Google Cloud, etc.)
const mockFileStorage = new Map<string, {
  id: string
  orderId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: string
  uploadedAt: Date
  url: string
  status: 'uploading' | 'completed' | 'failed'
}>()

// GET /api/orders/[orderId]/files - Get all files for an order
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get all files for this order
    const orderFiles = Array.from(mockFileStorage.values())
      .filter(file => file.orderId === orderId)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

    return NextResponse.json({
      success: true,
      data: orderFiles,
      message: `Found ${orderFiles.length} files for order ${orderId}`
    })
  } catch (error) {
    console.error('Get Files Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}

// POST /api/orders/[orderId]/files - Upload files for an order
export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const body = await request.json()
    
    const { fileName, fileSize, fileType, uploadedBy, fileData } = body
    
    if (!orderId || !fileName || !fileSize || !fileType || !uploadedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fileName, fileSize, fileType, uploadedBy' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    if (fileSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size cannot exceed 50MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ]

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Generate file ID and mock URL
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const mockUrl = `/api/files/${fileId}/download`

    // In production, upload to cloud storage here
    // const uploadResult = await uploadToCloudStorage(fileData, fileName, fileType)

    // Store file metadata
    const newFile = {
      id: fileId,
      orderId,
      fileName,
      fileSize,
      fileType,
      uploadedBy,
      uploadedAt: new Date(),
      url: mockUrl,
      status: 'completed' as const
    }

    mockFileStorage.set(fileId, newFile)

    return NextResponse.json({
      success: true,
      data: newFile,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Upload File Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[orderId]/files - Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    
    if (!orderId || !fileId) {
      return NextResponse.json(
        { success: false, error: 'Order ID and File ID are required' },
        { status: 400 }
      )
    }

    const file = mockFileStorage.get(fileId)
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      )
    }

    if (file.orderId !== orderId) {
      return NextResponse.json(
        { success: false, error: 'File does not belong to this order' },
        { status: 403 }
      )
    }

    // In production, delete from cloud storage here
    // await deleteFromCloudStorage(file.url)

    // Remove from storage
    mockFileStorage.delete(fileId)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Delete File Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
