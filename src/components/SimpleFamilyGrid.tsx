import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const familyMembers = [
  {
    id: 'marissa',
    name: 'Marissa',
    species: 'Human',
    age: 32,
    bloodType: 'O+',
    image: '/family-photos/Marissa.JPG',
    color: 'bg-pink-100',
    textColor: 'text-pink-800'
  },
  {
    id: 'jack',
    name: 'Jack',
    species: 'Human',
    age: 34,
    bloodType: 'A+',
    image: '/family-photos/Jack.jpg',
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    id: 'mike',
    name: 'Mike',
    species: 'Human',
    age: 64,
    bloodType: 'O-',
    image: '/family-photos/Mike.jpg',
    color: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    id: 'tonya',
    name: 'Tonya',
    species: 'Human',
    age: 64,
    bloodType: 'B+',
    image: '/family-photos/Tonya.jpg',
    color: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  {
    id: 'brandon',
    name: 'Brandon',
    species: 'Human',
    age: 29,
    bloodType: 'AB+',
    image: '/family-photos/Brandon.jpg',
    color: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  {
    id: 'bentley',
    name: 'Bentley',
    species: 'Dog',
    age: 4,
    breed: 'English Cream Golden Retriever',
    weight: '83.9 lbs',
    image: '/family-photos/Bentley.jpg',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  }
];

export default function SimpleFamilyGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {familyMembers.map((member) => (
        <Link key={member.id} href={`/family/${member.id}`}>
          <Card className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${member.color} border-0`}>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="text-2xl font-bold bg-white">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className={`text-xl font-bold ${member.textColor}`}>
                {member.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">
                  {member.species}
                </Badge>
                <p className="text-sm text-gray-600">
                  Age: {member.age} {member.species === 'Human' ? 'years' : 'years old'}
                </p>
                {member.bloodType && (
                  <p className="text-sm text-gray-600">
                    Blood Type: {member.bloodType}
                  </p>
                )}
                {member.breed && (
                  <p className="text-sm text-gray-600">
                    Breed: {member.breed}
                  </p>
                )}
                {member.weight && (
                  <p className="text-sm text-gray-600">
                    Weight: {member.weight}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
