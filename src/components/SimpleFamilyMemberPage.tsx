"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Define types for family members
type HumanMember = {
  name: string;
  species: 'Human';
  age: number;
  bloodType: string;
  birthday: string;
  image: string;
  tabs: string[];
};

type DogMember = {
  name: string;
  species: 'Dog';
  age: number;
  breed: string;
  weight: string;
  microchipId: string;
  birthday: string;
  image: string;
  tabs: string[];
};

type FamilyMember = HumanMember | DogMember;

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

// Hardcoded family member data
const familyData: Record<string, FamilyMember> = {
  marissa: {
    name: 'Marissa',
    species: 'Human',
    age: 32,
    bloodType: 'O+',
    birthday: 'March 15, 1992',
    image: '/family-photos/marissa.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  jack: {
    name: 'Jack',
    species: 'Human',
    age: 34,
    bloodType: 'A+',
    birthday: 'August 22, 1990',
    image: '/family-photos/Jack.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  mike: {
    name: 'Mike',
    species: 'Human',
    age: 64,
    bloodType: 'O-',
    birthday: 'December 3, 1960',
    image: '/family-photos/Mike.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  tonya: {
    name: 'Tonya',
    species: 'Human',
    age: 64,
    bloodType: 'B+',
    birthday: 'April 18, 1960',
    image: '/family-photos/Tonya.jpg',
    tabs: ['Overview', 'Medical Records', 'Documents']
  },
  brandon: {
    name: 'Brandon',
    species: 'Human',
    age: 29,
    bloodType: 'AB+',
    birthday: 'November 7, 1995',
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
    birthday: 'May 12, 2020',
    image: '/family-photos/Bentley.jpg',
    tabs: ['Overview', 'Health Summary', 'Vaccines', 'Medications', 'Medical History', 'Test Results', 'Documents', 'Reminders']
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
  },
  {
    id: '3',
    name: 'Microchip Information',
    type: 'Identification',
    uploadDate: '2024-11-26',
    size: '0.5 MB',
    url: 'https://drive.google.com/drive/folders/19p5BM-1nPQWWI3rVB6uY0ux_JkWsaJoa?usp=drive_link'
  },
  {
    id: '4',
    name: 'Vaccination Records',
    type: 'Medical',
    uploadDate: '2024-11-26',
    size: '1.2 MB',
    url: 'https://drive.google.com/drive/folders/16VW1Pw4JUhH8gtxeOa4bkfVGYmNfqHqw?usp=drive_link'
  }
];

// Storage keys for localStorage
const STORAGE_KEYS = {
  VACCINES: (memberId: string) => `family-health-vaccines-${memberId}`,
  TEST_RESULTS: (memberId: string) => `family-health-tests-${memberId}`,
  DOCUMENTS: (memberId: string) => `family-health-documents-${memberId}`,
  REMINDERS: (memberId: string) => `family-health-reminders-${memberId}`
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
  
  // Form states
  const [vaccineForm, setVaccineForm] = useState({
    name: '',
    dateGiven: '',
    nextDueDate: '',
    notes: ''
  });
  
  const [testForm, setTestForm] = useState({
    type: '',
    testDate: '',
    results: '',
    notes: ''
  });
  
  // Document upload state
  const [documentForm, setDocumentForm] = useState({
    name: '',
    type: '',
    file: null as File | null
  });
  
  // Data states
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // Edit states
  const [editingVaccine, setEditingVaccine] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<string | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const member = familyData[memberId as keyof typeof familyData];

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      setLoading(true);
      
      // Load vaccines
      const storedVaccines = localStorage.getItem(STORAGE_KEYS.VACCINES(memberId));
      if (storedVaccines) {
        setVaccines(JSON.parse(storedVaccines));
      } else if (isBentley) {
        setVaccines(initialVaccines);
      }
      
      // Load test results
      const storedTests = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS(memberId));
      if (storedTests) {
        setTestResults(JSON.parse(storedTests));
      } else if (isBentley) {
        setTestResults(initialTestResults);
      }
      
      // Load documents
      const storedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS(memberId));
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else if (isBentley) {
        setDocuments(initialDocuments);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      setError('Failed to load saved data. Starting with default data.');
      
      // Fallback to initial data
      if (isBentley) {
        setVaccines(initialVaccines);
        setTestResults(initialTestResults);
        setDocuments(initialDocuments);
      }
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.VACCINES(memberId), JSON.stringify(vaccines));
      } catch (err) {
        console.error('Error saving vaccines to localStorage:', err);
      }
    }
  }, [vaccines, memberId, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.TEST_RESULTS(memberId), JSON.stringify(testResults));
      } catch (err) {
        console.error('Error saving test results to localStorage:', err);
      }
    }
  }, [testResults, memberId, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS(memberId), JSON.stringify(documents));
      } catch (err) {
        console.error('Error saving documents to localStorage:', err);
      }
    }
  }, [documents, memberId, loading]);

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

  // Export data functionality
  const exportData = () => {
    const data = {
      member: member.name,
      exportDate: new Date().toISOString(),
      vaccines,
      testResults,
      documents
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${member.name.toLowerCase()}-health-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setVaccines([]);
      setTestResults([]);
      setDocuments([]);
      localStorage.removeItem(STORAGE_KEYS.VACCINES(memberId));
      localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS(memberId));
      localStorage.removeItem(STORAGE_KEYS.DOCUMENTS(memberId));
    }
  };

  // Handle vaccine form submission
  const handleVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVaccine) {
      // Update existing vaccine
      setVaccines(vaccines.map(v => 
        v.id === editingVaccine 
          ? { ...v, ...vaccineForm }
          : v
      ));
      setEditingVaccine(null);
    } else {
      // Add new vaccine
      const newVaccine: Vaccine = {
        id: Date.now().toString(),
        ...vaccineForm
      };
      setVaccines([...vaccines, newVaccine]);
    }
    
    setVaccineForm({ name: '', dateGiven: '', nextDueDate: '', notes: '' });
    setShowAddVaccine(false);
  };

  // Handle test result form submission
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTest) {
      // Update existing test
      setTestResults(testResults.map(t => 
        t.id === editingTest 
          ? { ...t, ...testForm }
          : t
      ));
      setEditingTest(null);
    } else {
      // Add new test
      const newTest: TestResult = {
        id: Date.now().toString(),
        ...testForm
      };
      setTestResults([...testResults, newTest]);
    }
    
    setTestForm({ type: '', testDate: '', results: '', notes: '' });
    setShowAddTest(false);
  };

  // Handle vaccine editing
  const handleEditVaccine = (vaccine: Vaccine) => {
    setVaccineForm({
      name: vaccine.name,
      dateGiven: vaccine.dateGiven,
      nextDueDate: vaccine.nextDueDate,
      notes: vaccine.notes
    });
    setEditingVaccine(vaccine.id);
    setShowAddVaccine(true);
  };

  // Handle test editing
  const handleEditTest = (test: TestResult) => {
    setTestForm({
      type: test.type,
      testDate: test.testDate,
      results: test.results,
      notes: test.notes
    });
    setEditingTest(test.id);
    setShowAddTest(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingVaccine(null);
    setEditingTest(null);
    setVaccineForm({ name: '', dateGiven: '', nextDueDate: '', notes: '' });
    setTestForm({ type: '', testDate: '', results: '', notes: '' });
    setShowAddVaccine(false);
    setShowAddTest(false);
  };

  // Handle vaccine deletion
  const handleDeleteVaccine = (id: string) => {
    if (confirm('Are you sure you want to delete this vaccine record?')) {
      setVaccines(vaccines.filter(v => v.id !== id));
    }
  };

  // Handle test result deletion
  const handleDeleteTest = (id: string) => {
    if (confirm('Are you sure you want to delete this test result?')) {
      setTestResults(testResults.filter(t => t.id !== id));
    }
  };

  // Handle document upload
  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (documentForm.file) {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: documentForm.name || documentForm.file.name,
        type: documentForm.type || 'Document',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(documentForm.file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setDocuments([...documents, newDocument]);
      setDocumentForm({ name: '', type: '', file: null });
      setShowUpload(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setDocumentForm({ ...documentForm, file });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

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
    const today = new Date();
    const birthday = new Date(birthdayString);
    
    // Set this year's birthday
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    
    // If this year's birthday has passed, calculate for next year
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get today's date in YYYY-MM-DD format for date inputs
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading family member data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            {(vaccines.length > 0 || testResults.length > 0 || documents.length > 0) && (
              <Button variant="outline" onClick={clearAllData} className="text-red-600 hover:text-red-700">
                Clear All Data
              </Button>
            )}
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
                <CardContent className="space-y-3">
                                          <div className="flex justify-between items-center">
                          <span className="font-semibold">Age:</span>
                          <span className="text-lg font-medium">{member.age} years</span>
                        </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Birthday:</span>
                    <span className="text-lg font-medium text-blue-600">{member.birthday}</span>
                  </div>
                  {'bloodType' in member && member.bloodType && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Blood Type:</span>
                      <Badge variant="outline" className="text-lg">{member.bloodType}</Badge>
                    </div>
                  )}
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
                  {editingVaccine ? 'Edit Vaccine' : 'Add Vaccine'}
                </Button>
              </div>
              
              {showAddVaccine && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{editingVaccine ? 'Edit Vaccine' : 'Add New Vaccine'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleVaccineSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Vaccine Name *</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="e.g., Rabies, DA2PP"
                            value={vaccineForm.name}
                            onChange={(e) => setVaccineForm({...vaccineForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Date Given *</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded mt-1"
                            value={vaccineForm.dateGiven}
                            onChange={(e) => setVaccineForm({...vaccineForm, dateGiven: e.target.value})}
                            max={today}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Next Due Date *</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded mt-1"
                            value={vaccineForm.nextDueDate}
                            onChange={(e) => setVaccineForm({...vaccineForm, nextDueDate: e.target.value})}
                            min={today}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">When booster/expiry is due</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="Any additional notes"
                            value={vaccineForm.notes}
                            onChange={(e) => setVaccineForm({...vaccineForm, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">
                          {editingVaccine ? 'Update Vaccine' : 'Save Vaccine'}
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {vaccines.map((vaccine) => (
                  <Card key={vaccine.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {vaccine.name}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditVaccine(vaccine)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteVaccine(vaccine.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date Given</p>
                          <p className="font-medium">{formatDate(vaccine.dateGiven)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Due Date</p>
                          <p className="font-medium text-lg font-bold text-orange-600">{formatDate(vaccine.nextDueDate)}</p>
                        </div>
                      </div>
                      {vaccine.notes && (
                        <p className="text-sm text-gray-600 mt-2">{vaccine.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
                  {editingTest ? 'Edit Test Result' : 'Add Test Result'}
                </Button>
              </div>
              
              {showAddTest && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{editingTest ? 'Edit Test Result' : 'Add New Test Result'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTestSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Test Type *</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="e.g., Blood Test, Urinalysis"
                            value={testForm.type}
                            onChange={(e) => setTestForm({...testForm, type: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Test Date *</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded mt-1"
                            value={testForm.testDate}
                            onChange={(e) => setTestForm({...testForm, testDate: e.target.value})}
                            max={today}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Results *</label>
                          <select 
                            className="w-full p-2 border rounded mt-1"
                            value={testForm.results}
                            onChange={(e) => setTestForm({...testForm, results: e.target.value})}
                            required
                          >
                            <option value="">Select result</option>
                            <option value="Normal">Normal</option>
                            <option value="Abnormal">Abnormal</option>
                            <option value="Elevated">Elevated</option>
                            <option value="Low">Low</option>
                            <option value="Positive">Positive</option>
                            <option value="Negative">Negative</option>
                            <option value="Inconclusive">Inconclusive</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="Any additional notes"
                            value={testForm.notes}
                            onChange={(e) => setTestForm({...testForm, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">
                          {editingTest ? 'Update Test Result' : 'Save Test Result'}
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {testResults.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {test.type}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditTest(test)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteTest(test.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardTitle>
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
                  <form onSubmit={handleDocumentUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Document Name (Optional)</label>
                        <input 
                          className="w-full p-2 border rounded mt-1" 
                          placeholder="Enter a custom name"
                          value={documentForm.name}
                          onChange={(e) => setDocumentForm({...documentForm, name: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use filename</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Document Type</label>
                        <select 
                          className="w-full p-2 border rounded mt-1"
                          value={documentForm.type}
                          onChange={(e) => setDocumentForm({...documentForm, type: e.target.value})}
                        >
                          <option value="">Select type</option>
                          <option value="Medical">Medical</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Identification">Identification</option>
                          <option value="Vaccination">Vaccination</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {documentForm.file ? (
                          <div className="text-green-600">
                            <p className="font-medium">File selected: {documentForm.file.name}</p>
                            <p className="text-sm">Size: {(documentForm.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600">Drag and drop files here, or click to select</p>
                            <p className="text-sm text-gray-500 mt-2">Supports PDF, Word, Images, and Text files</p>
                          </div>
                        )}
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={!documentForm.file}>
                        Upload Document
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isBentley ? (
                documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle className="text-sm flex justify-between items-center">
                        {doc.name}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Size:</span>
                          <span className="text-gray-800">{doc.size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Uploaded:</span>
                          <span className="text-gray-800">{formatDate(doc.uploadDate)}</span>
                        </div>
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
                          <p className="text-green-600 text-sm mt-2">✓ Uploaded successfully</p>
                        )}
                      </div>
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
