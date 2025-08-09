'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar } from 'lucide-react';

interface LabResult {
  id: string;
  date: string;
  testName: string;
  notes?: string;
  components: LabComponent[];
}

interface LabComponent {
  id: string;
  name: string;
  value?: number;
  unit?: string;
  referenceLow?: number;
  referenceHigh?: number;
  isAbnormal: boolean;
}

interface LabResultsProps {
  memberId: string;
}

export default function LabResults({ memberId }: LabResultsProps) {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabResults() {
      try {
        const response = await fetch(`/api/lab-results/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setLabResults(data);
        }
      } catch (error) {
        console.error('Error fetching lab results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLabResults();
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

  if (labResults.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Lab Results
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No lab results have been recorded yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lab Result
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lab Results
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lab Result
        </Button>
      </div>

      <div className="space-y-4">
        {labResults.map((result) => (
          <Card key={result.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {result.testName}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge variant={result.components.some(c => c.isAbnormal) ? "destructive" : "secondary"}>
                  {result.components.some(c => c.isAbnormal) ? "Abnormal" : "Normal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.components.length > 0 && (
                <div className="space-y-3">
                  {result.components.map((component) => (
                    <div key={component.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {component.name}
                        </div>
                        {component.value !== undefined && (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {component.value} {component.unit}
                            {component.referenceLow !== undefined && component.referenceHigh !== undefined && (
                              <span className="ml-2">
                                (Ref: {component.referenceLow}-{component.referenceHigh} {component.unit})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {component.isAbnormal && (
                        <Badge variant="destructive" className="ml-2">
                          Abnormal
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {result.notes && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {result.notes}
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



