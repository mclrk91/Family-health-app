import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Hardcoded family member data
const familyData = {
  marissa: {
    name: 'Marissa',
    species: 'Human',
    age: 32,
    bloodType: 'O+',
    image: '/family-photos/Marissa.JPG',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  jack: {
    name: 'Jack',
    species: 'Human',
    age: 34,
    bloodType: 'A+',
    image: '/family-photos/Jack.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  mike: {
    name: 'Mike',
    species: 'Human',
    age: 64,
    bloodType: 'O-',
    image: '/family-photos/Mike.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  tonya: {
    name: 'Tonya',
    species: 'Human',
    age: 64,
    bloodType: 'B+',
    image: '/family-photos/Tonya.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  brandon: {
    name: 'Brandon',
    species: 'Human',
    age: 29,
    bloodType: 'AB+',
    image: '/family-photos/Brandon.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  bentley: {
    name: 'Bentley',
    species: 'Dog',
    age: 4,
    breed: 'English Cream Golden Retriever',
    weight: '83.9 lbs',
    microchipId: '981020031240389',
    image: '/family-photos/Bentley.jpg',
    tabs: ['Overview', 'Health Summary', 'Vaccines', 'Medications', 'Medical History', 'Test Results', 'Documents', 'Reminders']
  }
};

interface SimpleFamilyMemberPageProps {
  memberId: string;
}

export default function SimpleFamilyMemberPage({ memberId }: SimpleFamilyMemberPageProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [nextExamDate, setNextExamDate] = useState('11/2025');

  const member = familyData[memberId as keyof typeof familyData];
  
  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Family Member Not Found</h1>
            <Link href="/">
              <Button>← Back to Family</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isBentley = memberId === 'bentley';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
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
                <Badge variant="secondary">{member.species}</Badge>
                {member.breed && <Badge variant="outline">{member.breed}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
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
                <CardContent className="space-y-2">
                  <p><span className="font-semibold">Age:</span> {member.age} {member.species === 'Human' ? 'years' : 'years old'}</p>
                  {member.bloodType && <p><span className="font-semibold">Blood Type:</span> {member.bloodType}</p>}
                  {member.breed && <p><span className="font-semibold">Breed:</span> {member.breed}</p>}
                  {member.weight && <p><span className="font-semibold">Weight:</span> {member.weight}</p>}
                  {member.microchipId && <p><span className="font-semibold">Microchip ID:</span> {member.microchipId}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><span className="font-semibold">Species:</span> {member.species}</p>
                  <p><span className="font-semibold">Status:</span> <Badge variant="default" className="bg-green-500">Healthy</Badge></p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Summary Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Health Summary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Current Weight</h3>
                      <p className="text-2xl font-bold text-blue-600">83.9 lbs</p>
                      <p className="text-sm text-gray-600">Last recorded: 11/26/2024</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Next Annual Exam</h3>
                      <p className="text-2xl font-bold text-orange-600">11/2025</p>
                      <p className="text-sm text-gray-600">Due in ~3 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Vaccines Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Vaccines" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vaccine History</h2>
                <Button onClick={() => setShowAddVaccine(!showAddVaccine)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vaccine
                </Button>
              </div>
              
              {showAddVaccine && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Vaccine</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Vaccine Name</label>
                        <input className="w-full p-2 border rounded mt-1" placeholder="e.g., Rabies, DA2PP" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date Given</label>
                        <input type="date" className="w-full p-2 border rounded mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Next Due Date</label>
                        <input type="date" className="w-full p-2 border rounded mt-1" />
                        <p className="text-xs text-gray-500 mt-1">When booster/expiry is due</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <input className="w-full p-2 border rounded mt-1" placeholder="Any additional notes" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button>Save Vaccine</Button>
                      <Button variant="outline" onClick={() => setShowAddVaccine(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Rabies Vaccine
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3" /></Button>
                        <Button size="sm" variant="outline"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date Given</p>
                        <p className="font-medium">11/26/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Due Date</p>
                        <p className="font-medium text-lg font-bold text-orange-600">11/26/2027</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">3 Year Rabies Vaccine</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      DA2PP Vaccine
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3" /></Button>
                        <Button size="sm" variant="outline"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date Given</p>
                        <p className="font-medium">11/26/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Due Date</p>
                        <p className="font-medium text-lg font-bold text-orange-600">11/26/2025</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Annual vaccination</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Medications Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Medications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medication History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium mb-4">Not on any medications currently.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-600">Antibiotics</h3>
                      <p className="text-sm text-gray-600">Cefpodoxime — 07-06-21</p>
                      <p className="text-sm text-gray-600">Doxycycline — 02-13-23</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-green-600">Pain/Anti-inflammatory</h3>
                      <p className="text-sm text-gray-600">Carprofen — 06-29-21 (post-neuter)</p>
                      <p className="text-sm text-gray-600">Hydrocodone — 02-13-23, 02-21-23 (for cough)</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-purple-600">Eye Drops</h3>
                      <p className="text-sm text-gray-600">NeoPolyDex — 12-14-21, 06-20-23</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-orange-600">Topical/Ear Treatments</h3>
                      <p className="text-sm text-gray-600">Chlorhex Rinse — 07-06-21</p>
                      <p className="text-sm text-gray-600">Epi-Otic — 11-15-22</p>
                      <p className="text-sm text-gray-600">Surolan — 11-15-22</p>
                      <p className="text-sm text-gray-600">Neo-Predef powder — 07-06-21</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <h3 className="font-semibold text-blue-600">Neuter Surgery</h3>
                      <p className="text-sm text-gray-600">06-29-21</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-red-600">Allergic Reaction to Neuter</h3>
                      <p className="text-sm text-gray-600">07-06-21 — treated with antibiotics, topical medication, and rinses</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-purple-600">Eye Inflammation / Discharge Episodes</h3>
                      <p className="text-sm text-gray-600">12-14-21 — prescribed NeoPolyDex drops</p>
                      <p className="text-sm text-gray-600">06-20-23 — prescribed NeoPolyDex drops</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-orange-600">Respiratory / Cough Episodes</h3>
                      <p className="text-sm text-gray-600">02-13-23 — cough, eye discharge, nasal discharge after daycare; treated with doxycycline & hydrocodone</p>
                      <p className="text-sm text-gray-600">02-21-23 — cough follow-up; hydrocodone prescribed</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-green-600">Parasite Exams</h3>
                      <p className="text-sm text-gray-600">Multiple dates, all normal</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-indigo-600">Heartworm Tests</h3>
                      <p className="text-sm text-gray-600">Annual, all negative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Test Results Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Test Results" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Test Results</h2>
                <Button onClick={() => setShowAddTest(!showAddTest)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test Result
                </Button>
              </div>
              
              {showAddTest && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Test Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Test Type</label>
                        <input className="w-full p-2 border rounded mt-1" placeholder="e.g., Blood Test, Urinalysis" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Test Date</label>
                        <input type="date" className="w-full p-2 border rounded mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Results</label>
                        <input className="w-full p-2 border rounded mt-1" placeholder="e.g., Normal, Elevated, etc." />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <input className="w-full p-2 border rounded mt-1" placeholder="Any additional notes" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button>Save Test Result</Button>
                      <Button variant="outline" onClick={() => setShowAddTest(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Heartworm Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Test Date</p>
                        <p className="font-medium">11/26/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Results</p>
                        <p className="font-medium text-green-600">Negative</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Annual heartworm test</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Parasite Examination</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Test Date</p>
                        <p className="font-medium">11/26/2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Results</p>
                        <p className="font-medium text-green-600">Normal</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Annual parasite examination</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Documents Tab */}
          <TabsContent value="Documents" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Documents</h2>
              <Button onClick={() => setShowUpload(!showUpload)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            
            {showUpload && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Upload New Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600">Drag and drop files here, or click to select</p>
                    <Button className="mt-4">Choose Files</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isBentley ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Pet Insurance Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href="https://drive.google.com/drive/folders/1_VL_bO-irNWL7MQBHbor0nBcRYUTK7Ud?usp=drive_link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View in Google Drive →
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Veterinary Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href="https://drive.google.com/drive/folders/1s3r8-nfIJM9_1mFJ3NXyhN2Sx8AeSMDl?usp=drive_link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View in Google Drive →
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Microchip Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href="https://drive.google.com/drive/folders/19p5BM-1nPQWWI3rVB6uY0ux_JkWsaJoa?usp=drive_link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View in Google Drive →
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Vaccination Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href="https://drive.google.com/drive/folders/16VW1Pw4JUhH8gtxeOa4bkfVGYmNfqHqw?usp=drive_link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View in Google Drive →
                      </a>
                    </CardContent>
                  </Card>
                </>
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

          {/* Reminders Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Reminders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-orange-800">Next Annual Exam</h3>
                            <p className="text-sm text-orange-600">Due: {nextExamDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setNextExamDate('12/2025')}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

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
