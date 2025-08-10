import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const familyMembers = [
  {
    id: 'marissa',
    name: 'Marissa',
    age: 32,
    birthday: 'September 1, 1991',
    image: '/family-photos/Marissa.JPG'
  },
  {
    id: 'jack',
    name: 'Jack',
    age: 34,
    birthday: 'May 22, 1989',
    image: '/family-photos/Jack.jpg'
  },
  {
    id: 'mike',
    name: 'Mike',
    age: 64,
    birthday: 'September 21, 1959',
    image: '/family-photos/Mike.jpg'
  },
  {
    id: 'tonya',
    name: 'Tonya',
    age: 64,
    birthday: 'November 5, 1959',
    image: '/family-photos/Tonya.jpg'
  },
  {
    id: 'brandon',
    name: 'Brandon',
    age: 29,
    birthday: 'April 19, 1994',
    image: '/family-photos/Brandon.jpg'
  },
  {
    id: 'bentley',
    name: 'Bentley',
    age: 4,
    breed: 'English Cream Golden Retriever',
    weight: '83.9 lbs',
    birthday: 'August 14, 2020',
    image: '/family-photos/Bentley.jpg'
  }
];

export default function SimpleFamilyGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {familyMembers.map((member) => (
        <Link key={member.id} href={`/family/${member.id}`}>
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white border border-gray-200">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={member.image} 
                    alt={member.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gray-100">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {member.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Age: {member.age} years
                  </p>
                  
                  {/* Simple Birthday Display */}
                  <p className="text-sm text-gray-600">
                    Birthday: {member.birthday}
                  </p>
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
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
