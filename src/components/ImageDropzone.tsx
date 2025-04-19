import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Upload } from 'lucide-react';

interface ImageDropzoneProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
}

export function ImageDropzone({ onImageUpload, currentImage }: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageUpload(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/svg+xml': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
      `}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-32 mx-auto object-contain"
          />
          <p className="text-sm text-gray-500">
            Click or drag to replace the image
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragActive ? (
              <Upload className="h-12 w-12 text-primary" />
            ) : (
              <Image className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-base">
              {isDragActive ? (
                "Drop your logo here"
              ) : (
                "Drag and drop your logo, or click to select"
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG or SVG (max. 2MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 