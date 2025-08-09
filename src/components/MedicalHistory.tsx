"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicalHistoryProps {
  memberId: string;
  memberName?: string;
}

export default function MedicalHistory({ memberId, memberName }: MedicalHistoryProps) {
  // For this request, render static history for Bentley only, no API calls.
  if (memberName === 'Bentley') {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Medical History / Diagnoses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-semibold">Neuter Surgery:</span> 06-29-21
            </div>
            <div>
              <span className="font-semibold">Allergic Reaction to Neuter:</span> 07-06-21 — treated with antibiotics, topical medication, and rinses
            </div>
            <div className="pt-2">
              <span className="font-semibold">Eye Inflammation / Discharge Episodes:</span>
              <div className="ml-4 mt-1 space-y-1">
                <div>12-14-21 — prescribed NeoPolyDex drops</div>
                <div>06-20-23 — prescribed NeoPolyDex drops</div>
              </div>
            </div>
            <div className="pt-2">
              <span className="font-semibold">Respiratory / Cough Episodes:</span>
              <div className="ml-4 mt-1 space-y-1">
                <div>02-13-23 — cough, eye discharge, nasal discharge after daycare; treated with doxycycline & hydrocodone</div>
                <div>02-21-23 — cough follow-up; hydrocodone prescribed</div>
              </div>
            </div>
            <div className="pt-2">
              <span className="font-semibold">Parasite Exams:</span> Multiple dates, all normal
            </div>
            <div>
              <span className="font-semibold">Heartworm Tests:</span> Annual, all negative
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For other members, we can keep the allergies component; not implementing here.
  return (
    <Card>
      <CardContent className="pt-6 text-sm text-gray-500">
        No medical history available.
      </CardContent>
    </Card>
  );
}
