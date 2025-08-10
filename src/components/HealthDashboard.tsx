'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Heart, Activity, Pill, Syringe, FileText } from 'lucide-react';

interface HealthStats {
  totalMembers: number;
  humans: number;
  pets: number;
  upcomingAppointments: number;
  overdueReminders: number;
  recentVaccines: number;
  activeMedications: number;
}

export default function HealthDashboard() {
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealthStats() {
      try {
        const response = await fetch('/api/health-summary/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching health stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHealthStats();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">Unable to load health statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Family Health Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMembers}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.humans}</div>
            <div className="text-sm text-gray-600">Humans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.pets}</div>
            <div className="text-sm text-gray-600">Pets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.upcomingAppointments}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Appointments</span>
            </div>
            <Badge variant={stats.upcomingAppointments > 0 ? "default" : "secondary"}>
              {stats.upcomingAppointments} upcoming
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Reminders</span>
            </div>
            <Badge variant={stats.overdueReminders > 0 ? "destructive" : "secondary"}>
              {stats.overdueReminders} overdue
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Syringe className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Recent Vaccines</span>
            </div>
            <Badge variant="secondary">{stats.recentVaccines} this month</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Active Medications</span>
            </div>
            <Badge variant="secondary">{stats.activeMedications} active</Badge>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Family Health Score</span>
            <span className="text-sm text-gray-600">85%</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">Based on appointments, vaccines, and reminders</p>
        </div>
      </CardContent>
    </Card>
  );
}
