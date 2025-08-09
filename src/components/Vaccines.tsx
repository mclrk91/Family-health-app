'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, AlertTriangle, Syringe, X, Pencil, Trash2, Check, Edit2 } from 'lucide-react';

interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
}

interface VaccinesProps {
  memberId: string;
}

export default function Vaccines({ memberId }: VaccinesProps) {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', nextDueDate: '', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', date: '', nextDueDate: '', notes: '' });

  useEffect(() => {
    async function fetchVaccines() {
      try {
        const response = await fetch(`/api/vaccines/${memberId}`);
        if (response.ok) {
          const data = await response.json();
          setVaccines(data);
        }
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVaccines();
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

  if (vaccines.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Syringe className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Vaccines Recorded
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            No vaccines have been recorded yet.
          </p>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vaccine
          </Button>
          {showAdd && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">New Vaccine</h4>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                  placeholder="Name (e.g., Rabies)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <p className="text-xs text-gray-500">Date given</p>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                  value={form.nextDueDate}
                  onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
                />
                <p className="text-xs text-gray-500">Next due date (booster/expiry)</p>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <Button
                  onClick={async () => {
                    const res = await fetch(`/api/vaccines/${memberId}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: form.name,
                        date: form.date,
                        nextDueDate: form.nextDueDate || undefined,
                        notes: form.notes || undefined,
                      }),
                    });
                    if (res.ok) {
                      const created = await res.json();
                      setVaccines((prev) => [created, ...prev]);
                      setShowAdd(false);
                      setForm({ name: '', date: '', nextDueDate: '', notes: '' });
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const isOverdue = (nextDueDate: string) => {
    return new Date(nextDueDate) < new Date();
  };

  const isDueSoon = (nextDueDate: string) => {
    const dueDate = new Date(nextDueDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return dueDate <= thirtyDaysFromNow && dueDate > today;
  };

  // Group vaccines by name and collate full records for each
  const vaccineNameToRecords: Record<string, Vaccine[]> = vaccines.reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {} as Record<string, Vaccine[]>);

  // Sort dates desc within each vaccine name
  Object.keys(vaccineNameToRecords).forEach((name) => {
    vaccineNameToRecords[name].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // Determine next due per vaccine name from the most recent entry that has a nextDueDate
  type NextDueInfo = { date: string; nextDueDate: string };
  const vaccineNameToNextDue: Record<string, NextDueInfo | undefined> = vaccines.reduce(
    (acc, v) => {
      const current = acc[v.name];
      if (v.nextDueDate) {
        if (!current || new Date(v.date) > new Date(current.date)) {
          acc[v.name] = { date: v.date, nextDueDate: v.nextDueDate };
        }
      }
      return acc;
    },
    {} as Record<string, NextDueInfo | undefined>
  );

  const groupedNames = Object.keys(vaccineNameToRecords).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vaccines</h2>
        <Button onClick={() => setShowAdd((s) => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccine
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 border rounded-lg bg-white/70 dark:bg-gray-800/70">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">New Vaccine</h4>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <span className="text-xs text-gray-500 md:col-span-1">Date given</span>
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              value={form.nextDueDate}
              onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
            />
            <span className="text-xs text-gray-500 md:col-span-1">Next due date (booster/expiry)</span>
            <input
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <Button
              onClick={async () => {
                const res = await fetch(`/api/vaccines/${memberId}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: form.name,
                    date: form.date,
                    nextDueDate: form.nextDueDate || undefined,
                    notes: form.notes || undefined,
                  }),
                });
                if (res.ok) {
                  const created = await res.json();
                  setVaccines((prev) => [created, ...prev]);
                  setShowAdd(false);
                  setForm({ name: '', date: '', nextDueDate: '', notes: '' });
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {groupedNames.map((name) => {
          const records = vaccineNameToRecords[name];
          const latestInfo = vaccineNameToNextDue[name];
          const nextDue = latestInfo?.nextDueDate;
          return (
            <Card key={name} className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {name}
                    </CardTitle>
                    <div className="mt-2 space-y-2">
                      {records.map((rec) => {
                        const isEditingRec = editingId === rec.id;
                        return (
                          <div key={rec.id} className="flex items-start justify-between gap-2">
                            {isEditingRec ? (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                                <input
                                  type="date"
                                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                                  value={editForm.date}
                                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                />
                                <input
                                  type="date"
                                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                                  value={editForm.nextDueDate}
                                  onChange={(e) => setEditForm({ ...editForm, nextDueDate: e.target.value })}
                                />
                                <input
                                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                                  placeholder="Notes"
                                  value={editForm.notes}
                                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-sm px-2 py-1 border rounded"
                                    onClick={async () => {
                                      const res = await fetch(`/api/vaccines/record/${rec.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          name,
                                          date: editForm.date,
                                          nextDueDate: editForm.nextDueDate || null,
                                          notes: editForm.notes || null,
                                        }),
                                      });
                                      if (res.ok) {
                                        const updated = await res.json();
                                        setVaccines((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
                                        setEditingId(null);
                                      }
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button className="text-sm px-2 py-1 border rounded" onClick={() => setEditingId(null)}>
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {new Date(rec.date).toLocaleDateString()}
                                </span>
                                {rec.notes && (
                                  <span className="text-xs text-gray-500">— {rec.notes}</span>
                                )}
                                {rec.nextDueDate && (
                                  <span className="ml-auto text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Next due: {new Date(rec.nextDueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            )}
                            {!isEditingRec && (
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-sm px-2 py-1 border rounded"
                                  onClick={() => {
                                    setEditingId(rec.id);
                                    setEditForm({
                                      name,
                                      date: rec.date.substring(0, 10),
                                      nextDueDate: rec.nextDueDate ? rec.nextDueDate.substring(0, 10) : '',
                                      notes: rec.notes || '',
                                    });
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-sm px-2 py-1 border rounded"
                                  onClick={async () => {
                                    const res = await fetch(`/api/vaccines/record/${rec.id}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      setVaccines((prev) => prev.filter((v) => v.id !== rec.id));
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {nextDue && (
                  <div className="flex flex-col items-end space-y-1">
                        {isOverdue(nextDue) && (
                          <Badge variant="destructive" className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Overdue</span>
                          </Badge>
                        )}
                        {isDueSoon(nextDue) && !isOverdue(nextDue) && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Due Soon</span>
                          </Badge>
                        )}
                    <span className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Next due: {new Date(nextDue).toLocaleDateString()}
                    </span>
                      </div>
                    )}
                    {/* Edit/Delete controls for the latest record of this vaccine name */}
                    {(() => {
                      const latest = vaccines
                        .filter((v) => v.name === name)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                      if (!latest) return null;
                      const isEditing = editingId === latest.id;
                      return (
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                className="text-sm px-2 py-1 border rounded"
                                onClick={async () => {
                                  const res = await fetch(`/api/vaccines/record/${latest.id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      name: editForm.name,
                                      date: editForm.date,
                                      nextDueDate: editForm.nextDueDate || null,
                                      notes: editForm.notes || null,
                                    }),
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setVaccines((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
                                    setEditingId(null);
                                  }
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                className="text-sm px-2 py-1 border rounded"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-sm px-2 py-1 border rounded"
                                onClick={() => {
                                  setEditingId(latest.id);
                                  setEditForm({
                                    name: latest.name,
                                    date: latest.date.substring(0, 10),
                                    nextDueDate: latest.nextDueDate ? latest.nextDueDate.substring(0, 10) : '',
                                    notes: latest.notes || '',
                                  });
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                className="text-sm px-2 py-1 border rounded"
                                onClick={async () => {
                                  const res = await fetch(`/api/vaccines/record/${latest.id}`, { method: 'DELETE' });
                                  if (res.ok) {
                                    setVaccines((prev) => prev.filter((v) => v.id !== latest.id));
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardHeader>
              {/* Inline edit form for latest record of this vaccine name */}
              {(() => {
                const latest = vaccines
                  .filter((v) => v.name === name)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                if (!latest || editingId !== latest.id) return null;
                return (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                        placeholder="Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                      <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                        value={editForm.nextDueDate}
                        onChange={(e) => setEditForm({ ...editForm, nextDueDate: e.target.value })}
                      />
                      <input
                        className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900"
                        placeholder="Notes"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      />
                    </div>
                  </div>
                );
              })()}
            </Card>
          );
        })}
      </div>
    </div>
  );
}


