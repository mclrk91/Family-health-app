'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Dog, Calendar, FileText, Activity, Pill, Syringe, FlaskConical, Heart, Upload, Stethoscope, Bell } from 'lucide-react';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import HealthSummary from './HealthSummary';
import LabResults from './LabResults';
import Vaccines from './Vaccines';
import Medications from './Medications';
import Allergies from './Allergies';
import Documents from './Documents';
import TestResults from './TestResults';
import MedicalRecords from './MedicalRecords';
import Reminders from './Reminders';
import Vitals from './Vitals';
import { getFamilyMemberPhoto, getFamilyMemberPhotoStyle } from '@/lib/utils';
import MedicalHistory from './MedicalHistory';

interface Person {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
  dateOfBirth: string;
  bloodType?: string;
  breed?: string;
  microchipId?: string;
  weight?: number;
  weightUnit?: string;
}

interface PageProps {
  memberId: string;
}

export default function FamilyMemberPage({ memberId }: PageProps) {
  const [member, setMember] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMember() {
      try {
        const response = await fetch(`/api/family-members/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setMember(data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching member:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [memberId, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatBirthday = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    return birthDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Header />
      
      {/* Member Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Family
          </Button>
          
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={getFamilyMemberPhoto(member.name)} 
                    alt={member.name}
                    className={getFamilyMemberPhotoStyle(member.name)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xl">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatBirthday(member.dateOfBirth)}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {getAge(member.dateOfBirth)} years old
                    </Badge>
                    {member.species === 'HUMAN' && member.bloodType && (
                      <Badge variant="outline">
                        Blood Type: {member.bloodType}
                      </Badge>
                    )}
                  </div>
                  {member.species === 'CANINE' && member.breed && (
                    <div className="mt-2">
                      <Badge variant="outline">
                        {member.breed}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Health Tabs */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="summary" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            {member.name !== 'Bentley' && (
              <TabsTrigger value="labs" className="flex items-center space-x-2">
                <FlaskConical className="h-4 w-4" />
                <span className="hidden sm:inline">Labs</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="vaccines" className="flex items-center space-x-2">
              <Syringe className="h-4 w-4" />
              <span className="hidden sm:inline">Vaccines</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">Medications</span>
            </TabsTrigger>
            {member.name === 'Bentley' ? (
              <TabsTrigger value="medical-history" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Medical History</span>
              </TabsTrigger>
            ) : (
              <TabsTrigger value="allergies" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Allergies</span>
              </TabsTrigger>
            )}
            {member.name !== 'Bentley' && (
              <TabsTrigger value="vitals" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Vitals</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="test-results" className="flex items-center space-x-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Test Results</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            {member.species === 'CANINE' && (
              <TabsTrigger value="medical-records" className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Medical Records</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <HealthSummary memberId={memberId} />
          </TabsContent>

          {member.name !== 'Bentley' && (
            <TabsContent value="labs" className="space-y-6">
              <LabResults memberId={memberId} />
            </TabsContent>
          )}

          <TabsContent value="vaccines" className="space-y-6">
            <Vaccines memberId={memberId} />
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Medications memberId={memberId} />
          </TabsContent>

          {member.name === 'Bentley' ? (
            <TabsContent value="medical-history" className="space-y-6">
              <MedicalHistory memberId={memberId} memberName={member.name} />
            </TabsContent>
          ) : (
            <TabsContent value="allergies" className="space-y-6">
              <Allergies memberId={memberId} />
            </TabsContent>
          )}

          {member.name !== 'Bentley' && (
            <TabsContent value="vitals" className="space-y-6">
              <Vitals memberId={memberId} />
            </TabsContent>
          )}

          <TabsContent value="test-results" className="space-y-6">
            <TestResults memberId={memberId} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Documents memberId={memberId} />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <Reminders memberId={memberId} />
          </TabsContent>

          {member.species === 'CANINE' && (
            <TabsContent value="medical-records" className="space-y-6">
              <MedicalRecords memberId={memberId} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
