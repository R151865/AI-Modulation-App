import { useState } from 'react'
import { Upload, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { uploadImage, checkImage } from '../services/api'

const ImagePanel = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [moderationResult, setModerationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setModerationResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      const result = await uploadImage(formData)
      console.log(result, "this is tresult")
      setModerationResult(result)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Image Moderation</h2>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full max-w-md">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {selectedImage ? selectedImage.name : 'Click to select an image'}
            </p>
          </label>
        </div>

        {previewUrl && (
          <div className="w-full max-w-md">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-contain rounded-lg border"
            />
            
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
            >
              <Upload size={20} className="mr-2" />
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Analyzing image...</p>
          </div>
        )}

        {moderationResult && !isLoading && (
          <div className="w-full bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Moderation Results:</h3>
            
            {moderationResult.flagged && (
              <div className="flex items-center text-danger-500 mb-2">
                <AlertTriangle size={16} className="mr-1" />
                <span>Content Flagged</span>
              </div>
            )}
            
            {moderationResult.categories && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Detected categories:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(moderationResult.categories).map(([category, score]) => (
                    <span
                      key={category}
                      className={`px-2 py-1 rounded text-xs ${
                        score > 0.7 ? 'bg-danger-100 text-danger-800' :
                        score > 0.4 ? 'bg-warning-100 text-warning-800' :
                        'bg-success-100 text-success-800'
                      }`}
                    >
                      {category}: {(score * 100).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {moderationResult.description && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">AI Description:</p>
                <p className="bg-white p-3 rounded border text-sm">
                  {moderationResult.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImagePanel