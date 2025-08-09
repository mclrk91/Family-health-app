import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FamilyMemberPage from '@/components/FamilyMemberPage';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function FamilyMemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<LoadingSpinner />}>
        <FamilyMemberPage memberId={id} />
      </Suspense>
    </div>
  );
}


