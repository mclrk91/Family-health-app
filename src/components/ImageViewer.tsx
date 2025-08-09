'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, ExternalLink, FileText } from 'lucide-react';

interface MedicalImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  googleDriveUrl?: string;
  date?: string;
  type: 'veterinary' | 'insurance' | 'certificate' | 'microchip' | 'other';
}

interface ImageViewerProps {
  images: MedicalImage[];
}

export default function ImageViewer({ images }: ImageViewerProps) {
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);

  const getImageIcon = (type: string) => {
    switch (type) {
      case 'veterinary':
        return '🏥';
      case 'insurance':
        return '📋';
      case 'certificate':
        return '🏆';
      case 'microchip':
        return '🔍';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Medical Images & Documents
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getImageIcon(image.type)}</span>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {image.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(image.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {image.description}
                </p>
                
                {/* Image Preview */}
                <div className="relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{image.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {image.description}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" asChild>
                            <a href={image.imageUrl} download target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                          {image.googleDriveUrl && (
                            <Button variant="outline" asChild>
                              <a 
                                href={image.googleDriveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View in Drive
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href={image.imageUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
