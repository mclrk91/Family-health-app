'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Calendar, Upload, X } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  notes?: string;
  createdAt: string;
}

interface DocumentsProps {
  memberId: string;
}

export default function Documents({ memberId }: DocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch(`/api/documents/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [memberId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Documents
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No documents have been uploaded yet.
          </p>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          {showUpload && (
            <div className="mt-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Upload Documents</h4>
                <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <DocumentUpload
                memberId={memberId}
                onUploadComplete={async () => {
                  setShowUpload(false);
                  // refresh list
                  try {
                    const response = await fetch(`/api/documents/${memberId}`);
                    if (response.ok) {
                      const data = await response.json();
                      setDocuments(data);
                    }
                  } catch {}
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('text')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documents
        </h2>
        <Button onClick={() => setShowUpload((s) => !s)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {showUpload && (
        <div className="mb-4">
          <DocumentUpload
            memberId={memberId}
            onUploadComplete={async () => {
              setShowUpload(false);
              try {
                const response = await fetch(`/api/documents/${memberId}`);
                if (response.ok) {
                  const data = await response.json();
                  setDocuments(data);
                }
              } catch {}
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getFileIcon(document.mimeType)}</span>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {document.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(document.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatFileSize(document.fileSize)}
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                {document.notes && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {document.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



