'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Download, Eye, FileText, Calendar, Weight, Microchip, Syringe, Heart, Activity } from 'lucide-react';
import ImageViewer from './ImageViewer';

interface MedicalRecord {
  id: string;
  title: string;
  type: 'vaccine' | 'vital' | 'allergy' | 'medication' | 'document' | 'reminder';
  date?: string;
  value?: string;
  notes?: string;
  imageUrl?: string;
  googleDriveUrl?: string;
}

interface MedicalImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  googleDriveUrl?: string;
  date?: string;
  type: 'veterinary' | 'insurance' | 'certificate' | 'microchip' | 'other';
}

interface MedicalRecordsProps {
  memberId: string;
}

interface FamilyMember {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
}

export default function MedicalRecords({ memberId }: MedicalRecordsProps) {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      try {
        const memberResponse = await fetch(`/api/family-members/${memberId}`);
        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setMember(memberData);
        }
      } catch (error) {
        console.error('Error fetching member:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [memberId]);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return <Syringe className="h-4 w-4" />;
      case 'vital':
        return <Activity className="h-4 w-4" />;
      case 'allergy':
        return <Heart className="h-4 w-4" />;
      case 'medication':
        return <FileText className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'vital':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'allergy':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'medication':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a
              href="https://drive.google.com/drive/folders/1PMzAO9rZ-EOXO2Stog442mmkKS8TK5Py?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Drive
            </a>
          </Button>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Google Drive Folders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member?.name === 'Bentley' ? (
              <>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1_VL_bO-irNWL7MQBHbor0nBcRYUTK7Ud?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pet Insurance Documents
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1s3r8-nfIJM9_1mFJ3NXyhN2Sx8AeSMDl?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Veterinary Records
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/19p5BM-1nPQWWI3rVB6uY0ux_JkWsaJoa?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Microchip className="h-4 w-4 mr-2" />
                    Microchip Information
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/16VW1Pw4JUhH8gtxeOa4bkfVGYmNfqHqw?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Syringe className="h-4 w-4 mr-2" />
                    Vaccination Records
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1PMzAO9rZ-EOXO2Stog442mmkKS8TK5Py?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pets Best Insurance Info
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1PMzAO9rZ-EOXO2Stog442mmkKS8TK5Py?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Licenses and Certificates
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1PMzAO9rZ-EOXO2Stog442mmkKS8TK5Py?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Microchip className="h-4 w-4 mr-2" />
                    Microchip and Info
                  </a>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <a
                    href="https://drive.google.com/drive/folders/1PMzAO9rZ-EOXO2Stog442mmkKS8TK5Py?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Veterinary Visits
                  </a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
