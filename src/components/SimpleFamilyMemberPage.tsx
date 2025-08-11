"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Define types for family members
type FamilyMember = {
  name: string;
  age: number;
  birthday: string;
  image: string;
  tabs: string[];
  breed?: string;
  weight?: string;
  microchipId?: string;
  microchipDate?: string;
};

// Define types for vaccines and test results
type Vaccine = {
  id: string;
  name: string;
  dateGiven: string;
  nextDueDate: string;
  notes: string;
};

type TestResult = {
  id: string;
  type: string;
  testDate: string;
  results: string;
  notes: string;
};

// Define types for documents
type Document = {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url?: string;
};

// Define types for weight records
type WeightRecord = {
  id: string;
  date: string;
  weight: number;
  notes?: string;
};

// Define types for medications
type Medication = {
  id: string;
  name: string;
  type: string;
  datePrescribed: string;
  notes: string;
};

// Hardcoded family member data
const familyData: Record<string, FamilyMember> = {
  marissa: {
    name: 'Marissa',
    age: 32,
    birthday: 'September 1, 1991',
    image: '/family-photos/Marissa.JPG',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  jack: {
    name: 'Jack',
    age: 34,
    birthday: 'May 22, 1989',
    image: '/family-photos/Jack.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  mike: {
    name: 'Mike',
    age: 64,
    birthday: 'September 21, 1959',
    image: '/family-photos/Mike.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  tonya: {
    name: 'Tonya',
    age: 64,
    birthday: 'November 5, 1959',
    image: '/family-photos/Tonya.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  brandon: {
    name: 'Brandon',
    age: 29,
    birthday: 'April 19, 1994',
    image: '/family-photos/Brandon.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  bentley: {
    name: 'Bentley',
    age: 4,
    breed: 'English Cream Golden Retriever',
    weight: '83.9 lbs',
    microchipId: '985141009123456',
    microchipDate: '2020-11-23',
    birthday: 'November 23, 2020',
    image: '/family-photos/Bentley.jpg',
    tabs: ['Overview', 'Vaccines', 'Medications', 'Medical History', 'Test Results', 'Documents']
  }
};

// Initial vaccine data for Bentley
const initialVaccines: Vaccine[] = [
  {
    id: '1',
    name: 'Rabies Vaccine',
    dateGiven: '2024-11-26',
    nextDueDate: '2027-11-26',
    notes: '3 Year Rabies Vaccine'
  },
  {
    id: '2',
    name: 'DA2PP Vaccine',
    dateGiven: '2024-11-26',
    nextDueDate: '2025-11-26',
    notes: 'Annual vaccination'
  },
  {
    id: '3',
    name: 'Bordetella Vaccine',
    dateGiven: '2024-11-26',
    nextDueDate: '2025-11-26',
    notes: 'Annual vaccination'
  },
  {
    id: '4',
    name: 'Canine Influenza Vaccine',
    dateGiven: '2024-11-26',
    nextDueDate: '2025-11-26',
    notes: 'Annual vaccination'
  }
];

// Initial test results for Bentley
const initialTestResults: TestResult[] = [
  {
    id: '1',
    type: 'Heartworm Test',
    testDate: '2024-11-26',
    results: 'Negative',
    notes: 'Annual heartworm test'
  },
  {
    id: '2',
    type: 'Parasite Examination',
    testDate: '2024-11-26',
    results: 'Normal',
    notes: 'Annual parasite examination'
  }
];

// Initial documents for Bentley
const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Pet Insurance Documents',
    type: 'Insurance',
    uploadDate: '2024-11-26',
    size: '2.3 MB',
    url: 'https://drive.google.com/drive/folders/1_VL_bO-irNWL7MQBHbor0nBcRYUTK7Ud?usp=drive_link'
  },
  {
    id: '2',
    name: 'Veterinary Records',
    type: 'Medical',
    uploadDate: '2024-11-26',
    size: '1.8 MB',
    url: 'https://drive.google.com/drive/folders/1s3r8-nfIJM9_1mFJ3NXyhN2Sx8AeSMDl?usp=drive_link'
  }
];

// Initial medications for Bentley
const initialMedications: Medication[] = [
  {
    id: '1',
    name: 'Cefpodoxime',
    type: 'Antibiotics',
    datePrescribed: '2021-07-06',
    notes: 'For allergic reaction to neuter'
  },
  {
    id: '2',
    name: 'Doxycycline',
    type: 'Antibiotics',
    datePrescribed: '2023-02-13',
    notes: 'For respiratory infection'
  }
];

// Initial weight data for Bentley
const initialWeights: WeightRecord[] = [
  {
    id: '1',
    date: '2024-11-26',
    weight: 83.9,
    notes: 'Annual checkup'
  },
  {
    id: '2',
    date: '2023-11-26',
    weight: 83.9,
    notes: 'Annual checkup'
  }
];

interface SimpleFamilyMemberPageProps {
  memberId: string;
}

export default function SimpleFamilyMemberPage({ memberId }: SimpleFamilyMemberPageProps) {
  const member = familyData[memberId as keyof typeof familyData];
  
  // Safety check - if member doesn't exist, show error
  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Family member not found: {memberId}</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Family
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const isBentley = memberId === 'bentley' && 'breed' in member && member.breed;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  // Calculate days until next birthday
  const getDaysUntilBirthday = (birthdayString: string) => {
    try {
      const today = new Date();
      const birthday = new Date(birthdayString);
      
      if (isNaN(birthday.getTime())) {
        return 999;
      }
      
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = thisYearBirthday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      return 999;
    }
  };

  // Helper function to group vaccines by name
  const groupVaccinesByName = (vaccines: Vaccine[]) => {
    const grouped: Record<string, Vaccine[]> = {};
    vaccines.forEach(vaccine => {
      if (!grouped[vaccine.name]) {
        grouped[vaccine.name] = [];
      }
      grouped[vaccine.name].push(vaccine);
    });
    
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime());
    });
    
    return grouped;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Family
              </Button>
            </Link>
            <div className="flex items-center">
              <Avatar className="w-16 h-16 mr-4 border-4 border-white shadow-lg">
                <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-gray-100">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {'breed' in member && member.breed && <Badge variant="outline">{member.breed}</Badge>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Birthday Alert */}
        {(() => {
          const daysUntil = getDaysUntilBirthday(member.birthday);
          if (daysUntil <= 7) {
            return (
              <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎂</div>
                    <div>
                      <h3 className="font-semibold text-pink-800">
                        {daysUntil === 0 ? 'Happy Birthday Today!' : 
                         daysUntil === 1 ? 'Birthday Tomorrow!' : 
                         `${daysUntil} days until ${member.name}'s birthday!`}
                      </h3>
                      <p className="text-sm text-pink-700">
                        {member.name} was born on {member.birthday}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">{member.birthday}</p>
                    <p className="text-sm text-pink-600">
                      {member.age} years
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Tabs */}
        <Tabs defaultValue="Overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {member.tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="Overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Age:</span>
                    <span className="text-lg font-medium">{member.age} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Birthday:</span>
                    <span className="text-lg font-medium text-blue-600">{member.birthday}</span>
                  </div>

                  {'breed' in member && member.breed && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Breed:</span>
                      <span className="text-lg font-medium">{member.breed}</span>
                    </div>
                  )}
                  {'weight' in member && member.weight && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Weight:</span>
                      <span className="text-lg font-medium">{member.weight}</span>
                    </div>
                  )}
                  {'microchipId' in member && member.microchipId && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Microchip ID:</span>
                      <span className="text-sm font-mono text-gray-600">{member.microchipId}</span>
                    </div>
                  )}
                  {'microchipDate' in member && member.microchipDate && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Microchip Date:</span>
                      <span className="text-sm text-gray-600">Implanted {member.microchipDate}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">🎂 Birthday Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-2">{member.birthday}</p>
                    <p className="text-sm text-blue-700">
                      {member.age} years
                    </p>
                  </div>
                  <div className="text-center pt-2">
                    {(() => {
                      const daysUntil = getDaysUntilBirthday(member.birthday);
                      if (daysUntil === 0) {
                        return (
                          <Badge variant="default" className="bg-green-500 text-white">
                            🎉 Happy Birthday Today!
                          </Badge>
                        );
                      } else if (daysUntil === 1) {
                        return (
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                            🎂 Birthday Tomorrow!
                          </Badge>
                        );
                      } else if (daysUntil <= 7) {
                        return (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                            🎂 {daysUntil} days until birthday
                          </Badge>
                        );
                      } else {
                        return (
                          <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                            🎂 {daysUntil} days until birthday
                          </Badge>
                        );
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><span className="font-semibold">Status:</span> <Badge variant="default" className="bg-green-500">Healthy</Badge></p>
                </CardContent>
              </Card>

              {/* Weight Chart and Table - Only for Bentley */}
              {isBentley && (
                <>
                  {/* Weight Table */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">⚖️ Weight History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-blue-200">
                              <th className="text-left py-2 font-medium text-blue-800">Date</th>
                              <th className="text-left py-2 font-medium text-blue-800">Weight</th>
                              <th className="text-left py-2 font-medium text-blue-800">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {initialWeights.map((weight) => (
                              <tr key={weight.id} className="border-b border-blue-100 hover:bg-blue-50">
                                <td className="py-2">{formatDate(weight.date)}</td>
                                <td className="py-2 font-medium">{weight.weight} lbs</td>
                                <td className="py-2 text-gray-600">{weight.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Vaccines Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Vaccines" className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Vaccination History</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupVaccinesByName(initialVaccines)).map(([vaccineName, vaccineList]) => (
                  <Card key={vaccineName} className="h-fit">
                    <CardHeader>
                      <CardTitle className="text-lg">{vaccineName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {vaccineList.map((vaccine) => (
                          <div key={vaccine.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{formatDate(vaccine.dateGiven)}</span>
                                <span className="text-sm text-gray-600">→ Next due: {formatDate(vaccine.nextDueDate)}</span>
                                {vaccine.notes && (
                                  <Badge variant="outline" className="text-xs">
                                    {vaccine.notes}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Medications Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Medications" className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Medication History</h2>
              </div>

              <div className="space-y-4">
                {initialMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader>
                      <CardTitle>{medication.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <Badge variant="outline">{medication.type}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date Prescribed</p>
                          <p className="font-medium">{formatDate(medication.datePrescribed)}</p>
                        </div>
                      </div>
                      {medication.notes && (
                        <p className="text-sm text-gray-600 mt-2">{medication.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Medical History Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Medical History" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical History & Diagnoses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-600">Respiratory / Cough Episodes</h3>
                      <p className="text-sm text-gray-600">02-21-23 — cough follow-up; hydrocodone prescribed</p>
                      <p className="text-sm text-gray-600">02-13-23 — cough, eye discharge, nasal discharge after daycare; treated with doxycycline & hydrocodone</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-blue-600">Eye Inflammation / Discharge Episodes</h3>
                      <p className="text-sm text-gray-600">06-20-23 — prescribed NeoPolyDex drops</p>
                      <p className="text-sm text-gray-600">12-14-21 — prescribed NeoPolyDex drops</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-blue-600">Allergic Reaction to Neuter</h3>
                      <p className="text-sm text-gray-600">07-06-21 — treated with antibiotics, topical medication, and rinses</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-blue-600">Neuter Surgery</h3>
                      <p className="text-sm text-gray-600">06-29-21</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Test Results Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Test Results" className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Test Results</h2>
              </div>

              <div className="space-y-4">
                {initialTestResults.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle>{test.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Test Date</p>
                          <p className="font-medium">{formatDate(test.testDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Results</p>
                          <Badge 
                            variant={test.results === 'Normal' || test.results === 'Negative' ? 'default' : 'destructive'}
                            className={test.results === 'Normal' || test.results === 'Negative' ? 'bg-green-500' : ''}
                          >
                            {test.results}
                          </Badge>
                        </div>
                      </div>
                      {test.notes && (
                        <p className="text-sm text-gray-600 mt-2">{test.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Documents Tab */}
          <TabsContent value="Documents" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isBentley ? (
                initialDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{doc.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {doc.url ? (
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm block mt-2"
                        >
                          View in Google Drive →
                        </a>
                      ) : (
                        <p className="text-green-600 text-sm mt-2">✓ Document available</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Medical Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">No documents uploaded yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Medical Records Tab (Humans only) */}
          {!isBentley && (
            <TabsContent value="Medical Records" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No medical records available yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
