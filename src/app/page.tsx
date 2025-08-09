import { Suspense } from 'react';
import FamilyMemberGrid from '@/components/FamilyMemberGrid';
import QuestionAnswerBox from '@/components/QuestionAnswerBox';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Family Health Hub
          </h1>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <FamilyMemberGrid />
        </Suspense>

        <QuestionAnswerBox />
      </main>
    </div>
  );
}
