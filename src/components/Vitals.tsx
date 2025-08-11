'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Activity, Calendar } from 'lucide-react';

interface Vital {
  id: string;
  type: string;
  value: number;
  unit?: string;
  date: string;
  notes?: string;
}

interface VitalsProps {
  memberId: string;
}

export default function Vitals({ memberId }: VitalsProps) {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVitals() {
      try {
        const response = await fetch(`/api/vitals/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setVitals(data);
        }
      } catch (error) {
        console.error('Error fetching vitals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVitals();
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

  if (vitals.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Vitals Recorded
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No vital signs have been recorded yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vital Signs
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getVitalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blood pressure':
        return '🩸';
      case 'heart rate':
        return '❤️';
      case 'temperature':
        return '🌡️';
      case 'weight':
        return '⚖️';
      default:
        return '📊';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vital Signs
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vital Signs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map((vital) => (
          <Card key={vital.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getVitalIcon(vital.type)}</span>
                    <span>{vital.type}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(vital.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {vital.value} {vital.unit}
              </div>
              {vital.notes && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {vital.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}




