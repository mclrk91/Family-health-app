'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  memberId: string;
  onUploadComplete?: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function DocumentUpload({ memberId, onUploadComplete }: DocumentUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload progress
    acceptedFiles.forEach((file, index) => {
      const fileIndex = uploadingFiles.length + index;
      simulateUpload(file, fileIndex);
    });
  }, [uploadingFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.doc', '.docx']
    },
    multiple: true
  });

  const simulateUpload = async (file: File, fileIndex: number) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadingFiles(prev => 
        prev.map((f, index) => 
          index === fileIndex 
            ? { ...f, progress: i }
            : f
        )
      );
    }

    // Simulate completion
    setUploadingFiles(prev => 
      prev.map((f, index) => 
        index === fileIndex 
          ? { ...f, status: 'completed' as const }
          : f
      )
    );

    // Check if all uploads are complete
    const allComplete = uploadingFiles.every(f => f.status === 'completed');
    if (allComplete) {
      setIsUploading(false);
      onUploadComplete?.();
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Drop the files here...
            </p>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Supports PDF, images, and text documents
              </p>
            </div>
          )}
        </div>

        {uploadingFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Uploading Files</h4>
            {uploadingFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <File className="h-8 w-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <div className="flex-1 max-w-xs">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <span className="text-red-500 text-sm">{file.error}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



