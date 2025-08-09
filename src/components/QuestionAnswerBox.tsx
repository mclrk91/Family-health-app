'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, MessageSquare } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
}

interface QAResponse {
  question: string;
  answer: string;
  timestamp: Date;
}

export default function QuestionAnswerBox() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  useEffect(() => {
    async function fetchFamilyMembers() {
      try {
        const response = await fetch('/api/family-members');
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setIsLoadingMembers(false);
      }
    }

    fetchFamilyMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, familyMembers }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.answer) {
        setResponse({
          question: question,
          answer: data.answer,
          timestamp: new Date(),
        });
      } else {
        const serverMsg = typeof data?.error === 'string' ? data.error : undefined;
        const friendly = serverMsg?.toLowerCase().includes('openai') || serverMsg?.toLowerCase().includes('quota')
          ? 'AI quota or billing appears to be unavailable. Please add billing to your OpenAI key or update the key in .env.local.'
          : (serverMsg ?? 'Sorry, I could not generate an answer.');

        setResponse({
          question: question,
          answer: friendly,
          timestamp: new Date(),
        });
      }
      
      setQuestion('');
    } catch (error) {
      console.error('Error processing question:', error);
      setResponse({
        question: question,
        answer: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingMembers) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 mt-8">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Ask About Family Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="e.g., What was Tonya's latest thyroid level?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Question: {response.question}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {response.answer}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {response.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p className="mb-2"><strong>Example questions:</strong></p>
          <ul className="space-y-1 list-disc list-inside">
            <li>"What was Tonya's latest thyroid level?"</li>
            <li>"When is Jack's next appointment?"</li>
            <li>"What medications is Mike taking?"</li>
            <li>"Does Brandon have any allergies?"</li>
            <li>"What are Marissa's recent test results?"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
