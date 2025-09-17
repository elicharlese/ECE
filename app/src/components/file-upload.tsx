'use client'

import React, { useState, useCallback } from 'react'
import { Upload, X, File, Image, FileText, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  existingFiles?: UploadedFile[]
  onRemoveFile?: (fileId: string) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadedAt: Date
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.zip'],
  existingFiles = [],
  onRemoveFile
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles)
  const [uploading, setUploading] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }, [])

  const handleFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        console.warn(`File ${file.name} is too large (max ${maxSize}MB)`)
        return false
      }
      
      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''))
        }
        return file.type === type || file.name.endsWith(type)
      })
      
      if (!isValidType) {
        console.warn(`File ${file.name} is not an accepted type`)
        return false
      }
      
      return true
    })

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      console.warn(`Cannot upload more than ${maxFiles} files`)
      return
    }

    setUploading(true)

    // Mock upload process - in real implementation, upload to cloud storage
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // In real app, this would be the cloud URL
      uploadedAt: new Date()
    }))

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    setUploadedFiles(prev => [...prev, ...newFiles])
    setUploading(false)

    if (onFilesChange) {
      onFilesChange(validFiles)
    }
  }, [uploadedFiles.length, maxFiles, maxSize, acceptedTypes, onFilesChange])

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    if (onRemoveFile) {
      onRemoveFile(fileId)
    }
  }, [onRemoveFile])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-ocean-info" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-monokai-accent" />
    return <File className="w-4 h-4 text-ocean-primary" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          dragActive 
            ? 'border-ocean-accent bg-ocean-accent/10' 
            : 'border-ocean-muted/30 hover:border-ocean-accent/50'
        } glass-light`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || uploadedFiles.length >= maxFiles}
        />
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: dragActive ? 1.1 : 1,
              rotate: uploading ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 0.2 },
              rotate: { duration: 2, repeat: uploading ? Infinity : 0, ease: "linear" }
            }}
            className="mx-auto mb-4"
          >
            <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-ocean-accent' : 'text-ocean-muted'}`} />
          </motion.div>
          
          <p className="text-sm text-ocean-dark dark:text-ocean-light mb-2">
            {uploading ? 'Uploading files...' : 'Drag and drop files here, or click to select'}
          </p>
          
          <p className="text-xs text-ocean-muted">
            Max {maxFiles} files, {maxSize}MB each. Supports {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-ocean-dark dark:text-ocean-light">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/50 dark:bg-ocean-dark/50 rounded-lg border border-ocean-muted/20"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-ocean-dark dark:text-ocean-light">
                      {file.name}
                    </p>
                    <p className="text-xs text-ocean-muted">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.url && (
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1 text-ocean-info hover:text-ocean-accent transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-ocean-muted hover:text-monokai-accent transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-ocean-muted/20 rounded-full h-2"
        >
          <motion.div
            className="bg-gradient-tide h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      )}
    </div>
  )
}

export default FileUpload
