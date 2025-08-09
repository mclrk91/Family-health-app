'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Dog } from 'lucide-react';
import Link from 'next/link';
import { getFamilyMemberPhoto, getFamilyMemberPhotoStyle } from '@/lib/utils';

interface Person {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
  dateOfBirth: string;
  bloodType?: string;
  breed?: string;
  microchipId?: string;
  weight?: number;
  weightUnit?: string;
}

export default function FamilyMemberGrid() {
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFamilyMembers() {
      try {
        const response = await fetch('/api/family-members');
        if (response.ok) {
          const data = await response.json();
          // Sort members in the specified order
          const sortedMembers = sortFamilyMembers(data);
          setFamilyMembers(sortedMembers);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFamilyMembers();
  }, []);

  const sortFamilyMembers = (members: Person[]) => {
    const order = ['Marissa', 'Jack', 'Mike', 'Tonya', 'Brandon', 'Bentley'];
    return members.sort((a, b) => {
      const aIndex = order.indexOf(a.name);
      const bIndex = order.indexOf(b.name);
      return aIndex - bIndex;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatBirthday = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    return birthDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {familyMembers.map((member) => (
        <Link key={member.id} href={`/family/${member.id}`}>
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={getFamilyMemberPhoto(member.name)} 
                    alt={member.name}
                    className={getFamilyMemberPhotoStyle(member.name)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatBirthday(member.dateOfBirth)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getAge(member.dateOfBirth)} years
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {member.species === 'CANINE' && member.breed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Breed:</span>
                    <span className="font-medium">{member.breed}</span>
                  </div>
                )}
                {member.species === 'CANINE' && member.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                    <span className="font-medium">{member.weight} {member.weightUnit}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
