'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';

interface Allergy {
  id: string;
  name: string;
  severity?: string;
  reaction?: string;
  notes?: string;
}

interface AllergiesProps {
  memberId: string;
}

export default function Allergies({ memberId }: AllergiesProps) {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllergies() {
      try {
        const response = await fetch(`/api/allergies/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setAllergies(data);
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllergies();
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

  if (allergies.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Allergies Recorded
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No allergies have been recorded yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Allergy
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Only listing allergy names; omit severity/reaction/notes for simplicity

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Allergies
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      <div className="space-y-2">
        {allergies.map((allergy) => (
          <div key={allergy.id} className="flex items-center">
            <span className="text-base text-gray-900 dark:text-white">{allergy.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


