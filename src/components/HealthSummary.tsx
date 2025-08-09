'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, AlertTriangle, TrendingUp, Info, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthSummaryProps {
  memberId: string;
}

interface FamilyMember {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
  weight?: number;
  weightUnit?: string;
  breed?: string;
  microchipId?: string;
}

interface HealthData {
  upcomingAppointments: number;
  allergies: number;
  lastVitalDate?: string;
  overdueReminders: number;
  recentVaccines: number;
  activeMedications: number;
  totalVaccines: number;
  lastLabDate?: string;
}

interface WeightData {
  date: string;
  weight: number;
  unit: string;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

export default function HealthSummary({ memberId }: HealthSummaryProps) {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  const fetchHealthData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    try {
      setError({ hasError: false, message: '' });
      
      // Fetch family member information
      const memberResponse = await fetch(`/api/family-members/${memberId}`);
      if (!memberResponse.ok) {
        throw new Error('Failed to fetch family member data');
      }
      
      const memberData = await memberResponse.json();
      setMember(memberData);
      
      // Fetch additional data for Bentley
      if (memberData.name === 'Bentley') {
        await fetchWeightData(memberId);
      }
      
      // Fetch health summary
      const healthResponse = await fetch(`/api/health-summary/${memberId}`);
      if (!healthResponse.ok) {
        throw new Error('Failed to fetch health summary data');
      }
      
      const healthSummaryData = await healthResponse.json();
      setHealthData(healthSummaryData);
      
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError({ 
        hasError: true, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWeightData = async (id: string) => {
    try {
      const vitalsResponse = await fetch(`/api/vitals/${id}`);
      if (vitalsResponse.ok) {
        const vitalsData = await vitalsResponse.json();
        const weightEntries = vitalsData
          .filter((vital: { type: string; date: string; value: number; unit?: string }) => vital.type === 'weight')
          .map((vital: { type: string; date: string; value: number; unit?: string }) => ({
            date: vital.date,
            weight: vital.value,
            unit: vital.unit || 'lbs'
          }))
          .sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setWeightData(weightEntries);
      }
    } catch (error) {
      console.error('Error fetching weight data:', error);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [memberId]);

  const handleRefresh = () => {
    fetchHealthData(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Health Summary</h2>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error.hasError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Health Summary</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error loading health data</span>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!healthData || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Health Summary</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No health data available for this family member.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Health Summary</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {/* Allergies for non-Bentley only (Medical History moved to its own tab) */}
        {member?.name !== 'Bentley' && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Allergies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.allergies}</div>
              <p className="text-xs text-muted-foreground">
                {healthData.allergies === 0 ? 'No known allergies' : 'Allergic conditions'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weight - Only for Bentley */}
        {member?.name === 'Bentley' && member.weight && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{member.weight} {member.weightUnit}</div>
              <p className="text-xs text-muted-foreground">
                Last recorded weight
              </p>
              {weightData.length > 1 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Weight trend</span>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {(() => {
                              const latest = weightData[weightData.length - 1];
                              const previous = weightData[weightData.length - 2];
                              if (latest && previous) {
                                const change = latest.weight - previous.weight;
                                return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
                              }
                              return '-';
                            })()}
                            <Info className="inline h-3 w-3 ml-1" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Weight change from previous measurement</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <Progress 
                    value={Math.min(100, Math.max(0, ((member.weight - 70) / (85 - 70)) * 100))} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>70 lbs</span>
                    <span>85 lbs</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Target weight range for Golden Retriever
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weight Chart and Table - Only for Bentley */}
      {member?.name === 'Bentley' && weightData.length > 0 && (
        <div className="space-y-4">
          {/* Weight Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Weight Progress Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [`${value} ${weightData[0]?.unit || 'lbs'}`, 'Weight']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#1e40af', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Weight Table */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Weight</th>
                      <th className="text-left py-2 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightData.map((entry, index) => {
                      const prevWeight = index > 0 ? weightData[index - 1].weight : null;
                      const change = prevWeight ? entry.weight - prevWeight : null;
                      const changeText = change ? (change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)) : '-';
                      const changeColor = change ? (change > 0 ? 'text-red-500' : 'text-green-500') : 'text-gray-500';
                      
                      return (
                        <tr key={entry.date} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="py-2 font-medium">{entry.weight} {entry.unit}</td>
                          <td className={`py-2 ${changeColor}`}>{changeText}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

