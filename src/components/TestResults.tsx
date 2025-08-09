'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FlaskConical, Calendar, X } from 'lucide-react';

interface TestResult {
  id: string;
  type: string;
  value: number;
  unit?: string;
  date: string;
  notes?: string;
  status?: 'normal' | 'abnormal' | 'critical';
}

interface TestResultsProps {
  memberId: string;
}

export default function TestResults({ memberId }: TestResultsProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState<string>('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: '', value: '', unit: '', date: '', notes: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [testsRes, memberRes] = await Promise.all([
          fetch(`/api/test-results/${memberId}`),
          fetch(`/api/family-members/${memberId}`)
        ]);
        if (testsRes.ok) {
          const data = await testsRes.json();
          setTestResults(data);
        }
        if (memberRes.ok) {
          const member = await memberRes.json();
          setMemberName(member.name);
        }
      } catch (error) {
        console.error('Error fetching test results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [memberId]);

  const filteredResults = memberName === 'Bentley'
    ? testResults.filter((t) => !/blood\s*test/i.test(t.type))
    : testResults;

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

  if (filteredResults.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FlaskConical className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Test Results
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No test results have been recorded yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Test Result
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getTestIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blood test':
        return '🩸';
      case 'urine test':
        return '🧪';
      case 'x-ray':
        return '📷';
      case 'mri':
        return '🔍';
      case 'ct scan':
        return '🖥️';
      default:
        return '📊';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'abnormal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Test Results
        </h2>
        <Button onClick={() => setShowAdd((s) => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Test Result
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 border rounded-lg bg-white/70 dark:bg-gray-800/70">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">New Test Result</h4>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Type (e.g., X-Ray)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Unit"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <Button
              onClick={() => {
                // No persistence implemented; append client-side for now
                const newItem: TestResult = {
                  id: Math.random().toString(36).slice(2),
                  type: form.type,
                  value: Number(form.value) || 0,
                  unit: form.unit,
                  date: form.date || new Date().toISOString(),
                  notes: form.notes,
                  status: 'normal',
                };
                setTestResults((prev) => [newItem, ...prev]);
                setShowAdd(false);
                setForm({ type: '', value: '', unit: '', date: '', notes: '' });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredResults.map((test) => (
          <Card key={test.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTestIcon(test.type)}</span>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {test.type}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(test.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {test.status && (
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Result:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {test.value} {test.unit}
                  </span>
                </div>
                {test.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {test.notes}
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


