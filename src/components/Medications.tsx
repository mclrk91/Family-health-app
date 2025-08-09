'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Pill, Calendar } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

interface MedicationsProps {
  memberId: string;
}

export default function Medications({ memberId }: MedicationsProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [medsRes, memberRes] = await Promise.all([
          fetch(`/api/medications/${memberId}`),
          fetch(`/api/family-members/${memberId}`)
        ]);
        if (medsRes.ok) {
          const meds = await medsRes.json();
          setMedications(meds);
        }
        if (memberRes.ok) {
          const member = await memberRes.json();
          setMemberName(member.name);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  // Special case: Bentley — show historical list and a note about no current meds
  if (memberName === 'Bentley') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Medications / Prescriptions
          </h2>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-3">Not on any medications currently.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Antibiotics</div>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Cefpodoxime — 07-06-21</li>
                  <li>Doxycycline — 02-13-23</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Pain/Anti-inflammatory</div>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Carprofen — 06-29-21 (post-neuter)</li>
                  <li>Hydrocodone — 02-13-23, 02-21-23 (for cough)</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Eye Drops</div>
                <ul className="ml-4 list-disc space-y-1">
                  <li>NeoPolyDex — 12-14-21, 06-20-23</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Topical/Ear Treatments</div>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Chlorhex Rinse — 07-06-21</li>
                  <li>Epi-Otic — 11-15-22</li>
                  <li>Surolan — 11-15-22</li>
                  <li>Neo-Predef powder — 07-06-21</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Pill className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Medications
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No medications have been recorded yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Medications
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>

      <div className="space-y-4">
        {medications.map((medication) => (
          <Card key={medication.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {medication.name}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-1">
                    {medication.dosage && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Dosage: {medication.dosage}
                      </span>
                    )}
                    {medication.frequency && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Frequency: {medication.frequency}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medication.startDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Started: {new Date(medication.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {medication.notes && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {medication.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



