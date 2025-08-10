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

// Initial vaccine data for Bentley - restructured to group by vaccine type
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
  },
  {
    id: '5',
    name: 'Rabies Vaccine',
    dateGiven: '2021-11-15',
    nextDueDate: '2024-11-15',
    notes: '3 Year Rabies Vaccine'
  },
  {
    id: '6',
    name: 'DA2PP Vaccine',
    dateGiven: '2023-11-21',
    nextDueDate: '2024-11-21',
    notes: 'Annual vaccination'
  },
  {
    id: '7',
    name: 'Bordetella Vaccine',
    dateGiven: '2023-11-21',
    nextDueDate: '2024-11-21',
    notes: 'Annual vaccination'
  },
  {
    id: '8',
    name: 'Canine Influenza Vaccine',
    dateGiven: '2023-01-24',
    nextDueDate: '2024-01-24',
    notes: 'Annual vaccination'
  },
  {
    id: '9',
    name: 'DA2PP Vaccine',
    dateGiven: '2022-11-15',
    nextDueDate: '2023-11-15',
    notes: 'Annual vaccination'
  },
  {
    id: '10',
    name: 'Bordetella Vaccine',
    dateGiven: '2022-11-15',
    nextDueDate: '2023-11-15',
    notes: 'Annual vaccination'
  },
  {
    id: '11',
    name: 'Canine Influenza Vaccine',
    dateGiven: '2022-01-13',
    nextDueDate: '2023-01-13',
    notes: 'Annual vaccination'
  },
  {
    id: '12',
    name: 'DA2PP Vaccine',
    dateGiven: '2021-11-15',
    nextDueDate: '2022-11-15',
    notes: 'Annual vaccination'
  },
  {
    id: '13',
    name: 'Bordetella Vaccine',
    dateGiven: '2021-11-15',
    nextDueDate: '2022-11-15',
    notes: 'Annual vaccination'
  },
  {
    id: '14',
    name: 'Canine Influenza Vaccine',
    dateGiven: '2021-01-13',
    nextDueDate: '2022-01-13',
    notes: '#2 of 2'
  },
  {
    id: '15',
    name: 'Canine Influenza Vaccine',
    dateGiven: '2020-12-23',
    nextDueDate: '2021-01-13',
    notes: '#1 of 2'
  },
  {
    id: '16',
    name: 'DA2PP Vaccine',
    dateGiven: '2020-12-23',
    nextDueDate: '2021-12-23',
    notes: 'Annual vaccination'
  },
  {
    id: '17',
    name: 'Bordetella Vaccine',
    dateGiven: '2020-12-23',
    nextDueDate: '2021-12-23',
    notes: 'Annual vaccination'
  },
  {
    id: '18',
    name: 'Rabies Vaccine',
    dateGiven: '2020-12-23',
    nextDueDate: '2021-12-23',
    notes: '1 Year'
  },
  {
    id: '19',
    name: 'DA2PP Vaccine',
    dateGiven: '2020-11-23',
    nextDueDate: '2021-11-23',
    notes: 'Initial vaccination'
  },
  {
    id: '20',
    name: 'Bordetella Vaccine',
    dateGiven: '2020-10-15',
    nextDueDate: '2021-10-15',
    notes: 'Initial vaccination'
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
  },
  {
    id: '3',
    name: 'Carprofen',
    type: 'Pain/Anti-inflammatory',
    datePrescribed: '2021-06-29',
    notes: 'Post-neuter pain management'
  },
  {
    id: '4',
    name: 'Hydrocodone',
    type: 'Pain/Anti-inflammatory',
    datePrescribed: '2023-02-13',
    notes: 'For cough'
  },
  {
    id: '5',
    name: 'Hydrocodone',
    type: 'Pain/Anti-inflammatory',
    datePrescribed: '2023-02-21',
    notes: 'Cough follow-up'
  },
  {
    id: '6',
    name: 'NeoPolyDex',
    type: 'Eye Drops',
    datePrescribed: '2021-12-14',
    notes: 'For eye inflammation'
  },
  {
    id: '7',
    name: 'NeoPolyDex',
    type: 'Eye Drops',
    datePrescribed: '2023-06-20',
    notes: 'For eye inflammation'
  },
  {
    id: '8',
    name: 'Chlorhex Rinse',
    type: 'Topical/Ear Treatments',
    datePrescribed: '2021-07-06',
    notes: 'For allergic reaction to neuter'
  },
  {
    id: '9',
    name: 'Epi-Otic',
    type: 'Topical/Ear Treatments',
    datePrescribed: '2022-11-15',
    notes: 'Ear treatment'
  },
  {
    id: '10',
    name: 'Surolan',
    type: 'Topical/Ear Treatments',
    datePrescribed: '2022-11-15',
    notes: 'Ear treatment'
  },
  {
    id: '11',
    name: 'Neo-Predef powder',
    type: 'Topical/Ear Treatments',
    datePrescribed: '2021-07-06',
    notes: 'For allergic reaction to neuter'
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
  },
  {
    id: '3',
    date: '2023-06-20',
    weight: 79.4,
    notes: 'Vet visit'
  },
  {
    id: '4',
    date: '2023-02-21',
    weight: 76.5,
    notes: 'Vet visit'
  },
  {
    id: '5',
    date: '2023-02-13',
    weight: 83.2,
    notes: 'Vet visit'
  },
  {
    id: '6',
    date: '2023-01-24',
    weight: 83.2,
    notes: 'Vet visit'
  },
  {
    id: '7',
    date: '2022-11-15',
    weight: 83.2,
    notes: 'Annual checkup'
  },
  {
    id: '8',
    date: '2022-01-13',
    weight: 83.2,
    notes: 'Vet visit'
  },
  {
    id: '9',
    date: '2021-12-14',
    weight: 79.8,
    notes: 'Vet visit'
  },
  {
    id: '10',
    date: '2020-11-23',
    weight: 75.0,
    notes: 'Initial vet visit'
  }
];

// Storage keys for localStorage
const STORAGE_KEYS = {
  VACCINES: (memberId: string) => `family-health-vaccines-${memberId}`,
  TEST_RESULTS: (memberId: string) => `family-health-tests-${memberId}`,
  DOCUMENTS: (memberId: string) => `family-health-documents-${memberId}`,
  WEIGHTS: (memberId: string) => `family-health-weights-${memberId}`,
  MEDICATIONS: (memberId: string) => `family-health-medications-${memberId}`,
};

interface SimpleFamilyMemberPageProps {
  memberId: string;
}

export default function SimpleFamilyMemberPage({ memberId }: SimpleFamilyMemberPageProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);

  const [nextExamDate, setNextExamDate] = useState('11/2025');
  const [editingExamDate, setEditingExamDate] = useState(false);
  
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
  
  // Weight form state
  const [weightForm, setWeightForm] = useState({
    date: '',
    weight: '',
    notes: ''
  });
  
  // Medication form state
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    type: '',
    datePrescribed: '',
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
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  
  // Edit states
  const [editingVaccine, setEditingVaccine] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [editingMedication, setEditingMedication] = useState<string | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const member = familyData[memberId as keyof typeof familyData];
  const isBentley = memberId === 'bentley' && 'breed' in member && member.breed;

  // Load data from localStorage on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
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
      
      // Load weights
      const storedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS(memberId));
      if (storedWeights) {
        setWeights(JSON.parse(storedWeights));
      } else if (isBentley) {
        setWeights(initialWeights);
      }
      
      // Load medications
      const storedMedications = localStorage.getItem(STORAGE_KEYS.MEDICATIONS(memberId));
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      } else if (isBentley) {
        setMedications(initialMedications);
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
        setWeights(initialWeights);
        setMedications(initialMedications);
      }
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.VACCINES(memberId), JSON.stringify(vaccines));
      } catch (err) {
        console.error('Error saving vaccines to localStorage:', err);
      }
    }
  }, [vaccines, memberId, loading]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.TEST_RESULTS(memberId), JSON.stringify(testResults));
      } catch (err) {
        console.error('Error saving test results to localStorage:', err);
      }
    }
  }, [testResults, memberId, loading]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS(memberId), JSON.stringify(documents));
      } catch (err) {
        console.error('Error saving documents to localStorage:', err);
      }
    }
  }, [documents, memberId, loading]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.WEIGHTS(memberId), JSON.stringify(weights));
      } catch (err) {
        console.error('Error saving weights to localStorage:', err);
      }
    }
  }, [weights, memberId, loading]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.MEDICATIONS(memberId), JSON.stringify(medications));
      } catch (err) {
        console.error('Error saving medications to localStorage:', err);
      }
    }
  }, [medications, memberId, loading]);



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

  // Export data functionality
  const exportData = () => {
    const data = {
      member: member.name,
      exportDate: new Date().toISOString(),
      vaccines,
      testResults,
      documents,
      weights,
      medications
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
      setWeights([]);
      setMedications([]);
      
      // Clear from localStorage (only on client side)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.VACCINES(memberId));
        localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS(memberId));
        localStorage.removeItem(STORAGE_KEYS.DOCUMENTS(memberId));
        localStorage.removeItem(STORAGE_KEYS.WEIGHTS(memberId));
        localStorage.removeItem(STORAGE_KEYS.MEDICATIONS(memberId));
      }
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

  // Handle weight form submission
  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWeight) {
      // Update existing weight
      setWeights(weights.map(w => 
        w.id === editingWeight 
          ? { ...w, ...weightForm, weight: parseFloat(weightForm.weight) }
          : w
      ));
      setEditingWeight(null);
    } else {
      // Add new weight
      const newWeight: WeightRecord = {
        id: Date.now().toString(),
        date: weightForm.date,
        weight: parseFloat(weightForm.weight),
        notes: weightForm.notes
      };
      setWeights([...weights, newWeight]);
    }
    
    setWeightForm({ date: '', weight: '', notes: '' });
    setShowAddWeight(false);
  };

  // Handle weight editing
  const handleEditWeight = (weight: WeightRecord) => {
    setWeightForm({
      date: weight.date,
      weight: weight.weight.toString(),
      notes: weight.notes || ''
    });
    setEditingWeight(weight.id);
    setShowAddWeight(true);
  };

  // Handle medication form submission
  const handleMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedication) {
      // Update existing medication
      setMedications(medications.map(m => 
        m.id === editingMedication 
          ? { ...m, ...medicationForm }
          : m
      ));
      setEditingMedication(null);
    } else {
      // Add new medication
      const newMedication: Medication = {
        id: Date.now().toString(),
        ...medicationForm
      };
      setMedications([...medications, newMedication]);
    }
    
    setMedicationForm({ name: '', type: '', datePrescribed: '', notes: '' });
    setShowAddMedication(false);
  };



  // Cancel editing
  const cancelEditing = () => {
    setEditingVaccine(null);
    setEditingTest(null);
    setEditingWeight(null);
    setEditingMedication(null);
    setVaccineForm({ name: '', dateGiven: '', nextDueDate: '', notes: '' });
    setTestForm({ type: '', testDate: '', results: '', notes: '' });
    setWeightForm({ date: '', weight: '', notes: '' });
    setMedicationForm({ name: '', type: '', datePrescribed: '', notes: '' });
    setShowAddVaccine(false);
    setShowAddTest(false);
    setShowAddWeight(false);
    setShowAddMedication(false);
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

  // Handle weight deletion
  const handleDeleteWeight = (id: string) => {
    if (confirm('Are you sure you want to delete this weight record?')) {
      setWeights(weights.filter(w => w.id !== id));
    }
  };

  // Handle medication editing
  const handleEditMedication = (medication: Medication) => {
    setMedicationForm({
      name: medication.name,
      type: medication.type,
      datePrescribed: medication.datePrescribed,
      notes: medication.notes
    });
    setEditingMedication(medication.id);
    setShowAddMedication(true);
  };



  // Handle medication deletion
  const handleDeleteMedication = (id: string) => {
    if (confirm('Are you sure you want to delete this medication record?')) {
      setMedications(medications.filter(m => m.id !== id));
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

  // Get current weight
  const getCurrentWeight = () => {
    if (weights.length === 0) return null;
    const sortedWeights = [...weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedWeights[0];
  };

  // Get weight change from previous
  const getWeightChange = (currentWeight: WeightRecord) => {
    if (weights.length < 2) return null;
    const sortedWeights = [...weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const previousWeight = sortedWeights[1];
    const change = currentWeight.weight - previousWeight.weight;
    return {
      change,
      isPositive: change > 0,
      previousWeight: previousWeight.weight
    };
  };

  // Generate weight chart with proper line chart
  const generateWeightChart = () => {
    if (weights.length === 0) return null;
    
    const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const minWeight = Math.min(...weights.map(w => w.weight));
    const maxWeight = Math.max(...weights.map(w => w.weight));
    const weightRange = maxWeight - minWeight;
    const chartHeight = 200;
    const chartWidth = 600;
    const padding = 40;
    
    if (sortedWeights.length === 1) {
      // Single point - show as a dot
      const x = padding;
      const y = chartHeight - padding - ((sortedWeights[0].weight - minWeight) / weightRange) * (chartHeight - 2 * padding);
      return (
        <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
          <circle cx={x} cy={y} r="4" fill="#3b82f6" />
          <text x={x} y={y + 20} textAnchor="middle" className="text-xs fill-gray-600">
            {sortedWeights[0].weight} lbs
          </text>
          <text x={x} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-gray-600">
            {formatDate(sortedWeights[0].date)}
          </text>
        </svg>
      );
    }
    
    // Multiple points - create line chart
    const points = sortedWeights.map((weight, index) => {
      const x = padding + (index / (sortedWeights.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((weight.weight - minWeight) / weightRange) * (chartHeight - 2 * padding);
      return { x, y, weight, date: weight.date };
    });
    
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    return (
      <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
        {/* Grid lines */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = padding + (i / 4) * (chartHeight - 2 * padding);
          const weight = maxWeight - (i / 4) * weightRange;
          return (
            <g key={i}>
              <line 
                x1={padding} y1={y} x2={chartWidth - padding} y2={y} 
                stroke="#e5e7eb" strokeWidth="1" 
              />
              <text x={padding - 10} y={y + 4} className="text-xs fill-gray-500">
                {weight.toFixed(1)}
              </text>
            </g>
          );
        })}
        
        {/* Line chart */}
        <path d={pathData} stroke="#3b82f6" strokeWidth="3" fill="none" />
        
        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
            <title>{point.weight} lbs on {formatDate(point.date)}</title>
          </g>
        ))}
        
        {/* X-axis labels */}
        {points.map((point, index) => (
          <text 
            key={index} 
            x={point.x} 
            y={chartHeight - 5} 
            textAnchor="middle" 
            className="text-xs fill-gray-600"
            transform={`rotate(-45 ${point.x} ${chartHeight - 5})`}
          >
            {formatDate(point.date)}
          </text>
        ))}
      </svg>
    );
  };

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
            {(vaccines.length > 0 || testResults.length > 0 || documents.length > 0 || weights.length > 0 || medications.length > 0) && (
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
                  {/* Weight Chart */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">📊 Weight Progress Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {weights.length > 0 ? (
                        <div className="h-48 w-full">
                          {generateWeightChart()}
                        </div>
                      ) : (
                        <div className="h-48 w-full flex items-center justify-center text-gray-500">
                          <p>No weight data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Weight Table */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">⚖️ Weight History</CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setShowAddWeight(!showAddWeight)}
                        className="ml-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Weight
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {showAddWeight && (
                        <div className="mb-4 p-4 bg-white rounded-lg border">
                          <form onSubmit={handleWeightSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="text-sm font-medium">Date *</label>
                                <input 
                                  type="date" 
                                  className="w-full p-2 border rounded mt-1"
                                  value={weightForm.date}
                                  onChange={(e) => setWeightForm({...weightForm, date: e.target.value})}
                                  max={today}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Weight (lbs) *</label>
                                <input 
                                  type="number" 
                                  step="0.1"
                                  className="w-full p-2 border rounded mt-1"
                                  placeholder="e.g., 83.9"
                                  value={weightForm.weight}
                                  onChange={(e) => setWeightForm({...weightForm, weight: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <input 
                                  className="w-full p-2 border rounded mt-1" 
                                  placeholder="e.g., Annual checkup"
                                  value={weightForm.notes}
                                  onChange={(e) => setWeightForm({...weightForm, notes: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" size="sm">
                                {editingWeight ? 'Update Weight' : 'Save Weight'}
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-blue-200">
                              <th className="text-left py-2 font-medium text-blue-800">Date</th>
                              <th className="text-left py-2 font-medium text-blue-800">Weight</th>
                              <th className="text-left py-2 font-medium text-blue-800">Change</th>
                              <th className="text-left py-2 font-medium text-blue-800">Notes</th>
                              <th className="text-left py-2 font-medium text-blue-800">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {weights.length > 0 ? (
                              [...weights]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((weight, index) => {
                                  const weightChange = index === 0 ? null : getWeightChange(weight);
                                  return (
                                    <tr key={weight.id} className="border-b border-blue-100 hover:bg-blue-50">
                                      <td className="py-2">{formatDate(weight.date)}</td>
                                      <td className="py-2 font-medium">{weight.weight} lbs</td>
                                      <td className="py-2">
                                        {weightChange ? (
                                          <span className={`font-medium ${weightChange.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                                            {weightChange.isPositive ? '+' : ''}{weightChange.change.toFixed(1)} lbs
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">-</span>
                                        )}
                                      </td>
                                      <td className="py-2 text-gray-600">{weight.notes || '-'}</td>
                                      <td className="py-2">
                                        <div className="flex gap-1">
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleEditWeight(weight)}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => handleDeleteWeight(weight.id)}
                                            className="text-red-600 hover:text-red-700"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                            ) : (
                              <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                  No weight records available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Next Annual Exam Card - Only for Bentley */}
              {isBentley && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">🏥 Next Annual Exam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      {editingExamDate ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={nextExamDate}
                            onChange={(e) => setNextExamDate(e.target.value)}
                            className="text-sm border rounded px-2 py-1 w-20"
                            placeholder="MM/YYYY"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingExamDate(false)}
                          >
                            ✓
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">{nextExamDate}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingExamDate(true)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>



          {/* Vaccines Tab (Bentley only) */}
          {isBentley && (
            <TabsContent value="Vaccines" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vaccination History</h2>
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
                            placeholder="e.g., Rabies, DA2PP, Bordetella"
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
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="e.g., 3 Year, Annual, #1 of 2"
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupVaccinesByName(vaccines)).map(([vaccineName, vaccineList]) => (
                  <Card key={vaccineName} className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-lg">{vaccineName}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setVaccineForm({
                              name: vaccineName,
                              dateGiven: '',
                              nextDueDate: '',
                              notes: ''
                            });
                            setShowAddVaccine(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Date
                        </Button>
                      </CardTitle>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medication History</h2>
                <Button onClick={() => setShowAddMedication(!showAddMedication)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {editingMedication ? 'Edit Medication' : 'Add Medication'}
                </Button>
              </div>
              
              {showAddMedication && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMedicationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Medication Name *</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="e.g., Cefpodoxime, Carprofen"
                            value={medicationForm.name}
                            onChange={(e) => setMedicationForm({...medicationForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type *</label>
                          <select 
                            className="w-full p-2 border rounded mt-1"
                            value={medicationForm.type}
                            onChange={(e) => setMedicationForm({...medicationForm, type: e.target.value})}
                            required
                          >
                            <option value="">Select type</option>
                            <option value="Antibiotics">Antibiotics</option>
                            <option value="Pain/Anti-inflammatory">Pain/Anti-inflammatory</option>
                            <option value="Eye Drops">Eye Drops</option>
                            <option value="Topical/Ear Treatments">Topical/Ear Treatments</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Date Prescribed *</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded mt-1"
                            value={medicationForm.datePrescribed}
                            onChange={(e) => setMedicationForm({...medicationForm, datePrescribed: e.target.value})}
                            max={today}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <input 
                            className="w-full p-2 border rounded mt-1" 
                            placeholder="e.g., For cough, post-neuter"
                            value={medicationForm.notes}
                            onChange={(e) => setMedicationForm({...medicationForm, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">
                          {editingMedication ? 'Update Medication' : 'Save Medication'}
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
                {medications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {medication.name}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditMedication(medication)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteMedication(medication.id)}
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
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-blue-600">Parasite Exams</h3>
                      <p className="text-sm text-gray-600">Multiple dates, all normal</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-blue-600">Heartworm Tests</h3>
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

// Helper function to group vaccines by name
const groupVaccinesByName = (vaccines: Vaccine[]) => {
  const grouped: Record<string, Vaccine[]> = {};
  vaccines.forEach(vaccine => {
    if (!grouped[vaccine.name]) {
      grouped[vaccine.name] = [];
    }
    grouped[vaccine.name].push(vaccine);
  });
  
  // Sort each group by date (newest first)
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime());
  });
  
  return grouped;
};
