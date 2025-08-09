'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Calendar, AlertTriangle, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  frequency: string;
  status: string;
  notes?: string;
  doctor?: {
    name: string;
  };
  clinic?: {
    name: string;
  };
}

interface RemindersProps {
  memberId: string;
}

export default function Reminders({ memberId }: RemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState<string>('');
  const [showAnnualExam, setShowAnnualExam] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReminders() {
      try {
        const [remRes, memberRes] = await Promise.all([
          fetch(`/api/reminders/${memberId}`),
          fetch(`/api/family-members/${memberId}`)
        ]);
        if (remRes.ok) {
          const data = await remRes.json();
          setReminders(data);
        }
        if (memberRes.ok) {
          const member = await memberRes.json();
          setMemberName(member.name);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReminders();
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

  // For Bentley, hide existing reminders and show a single editable item
  if (memberName === 'Bentley') {
    if (!showAnnualExam) {
      return (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Reminders
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              No health reminders have been set yet.
            </p>
            <Button onClick={() => setShowAnnualExam(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Annual Exam (11/2025)
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Health Reminders
          </h2>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Next Annual Exam
                    </CardTitle>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Upcoming</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: November 2025</span>
                    </div>
                    <span>•</span>
                    <span>Frequency: ANNUALLY</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowAnnualExam(false)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reminders
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No health reminders have been set yet.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return due <= thirtyDaysFromNow && due > today;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Health Reminders
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reminder.title}
                    </CardTitle>
                    <Badge variant={getStatusColor(reminder.status)} className="flex items-center space-x-1">
                      {getStatusIcon(reminder.status)}
                      <span>{reminder.status}</span>
                    </Badge>
                  </div>
                  {reminder.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {reminder.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>Frequency: {reminder.frequency}</span>
                    {reminder.doctor && (
                      <>
                        <span>•</span>
                        <span>Dr. {reminder.doctor.name}</span>
                      </>
                    )}
                    {reminder.clinic && (
                      <>
                        <span>•</span>
                        <span>{reminder.clinic.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {reminder.status === 'PENDING' && (
                    <div className="text-right">
                      {isOverdue(reminder.dueDate) ? (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Overdue</span>
                        </Badge>
                      ) : isDueSoon(reminder.dueDate) ? (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Due in {getDaysUntilDue(reminder.dueDate)} days</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Due in {getDaysUntilDue(reminder.dueDate)} days
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            {reminder.notes && (
              <CardContent>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:blue-200">
                    {reminder.notes}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
