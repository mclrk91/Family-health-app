import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Function to calculate days until next birthday
const getDaysUntilBirthday = (birthdayString: string) => {
  const today = new Date();
  const birthday = new Date(birthdayString);
  
  // Set this year's birthday
  const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  
  // If this year's birthday has passed, calculate for next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const familyMembers = [
  {
    id: 'marissa',
    name: 'Marissa',
    species: 'Human',
    age: 32,
    bloodType: 'O+',
    birthday: 'March 15, 1992',
    image: '/family-photos/marissa.jpg'
  },
  {
    id: 'jack',
    name: 'Jack',
    species: 'Human',
    age: 34,
    bloodType: 'A+',
    birthday: 'August 22, 1990',
    image: '/family-photos/Jack.jpg'
  },
  {
    id: 'mike',
    name: 'Mike',
    species: 'Human',
    age: 64,
    bloodType: 'O-',
    birthday: 'December 3, 1960',
    image: '/family-photos/Mike.jpg'
  },
  {
    id: 'tonya',
    name: 'Tonya',
    species: 'Human',
    age: 64,
    bloodType: 'B+',
    birthday: 'April 18, 1960',
    image: '/family-photos/Tonya.jpg'
  },
  {
    id: 'brandon',
    name: 'Brandon',
    species: 'Human',
    age: 29,
    bloodType: 'AB+',
    birthday: 'November 7, 1995',
    image: '/family-photos/Brandon.jpg'
  },
  {
    id: 'bentley',
    name: 'Bentley',
    species: 'Dog',
    age: 4,
    breed: 'English Cream Golden Retriever',
    weight: '83.9 lbs',
    birthday: 'May 12, 2020',
    image: '/family-photos/Bentley.jpg'
  }
];

export default function SimpleFamilyGrid() {
  // Debug: Log family members to console
  console.log('Family members with birthdays:', familyMembers.map(m => ({ name: m.name, birthday: m.birthday })));
  
  // Get upcoming birthdays (within 7 days)
  const upcomingBirthdays = familyMembers
    .map(member => ({
      ...member,
      daysUntil: getDaysUntilBirthday(member.birthday)
    }))
    .filter(member => member.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <>
      {/* Birthday Alert Section */}
      {upcomingBirthdays.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
          <h2 className="text-2xl font-bold text-pink-800 mb-4 text-center">🎂 Upcoming Birthdays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBirthdays.map((member) => (
              <div key={member.id} className="bg-white p-4 rounded-lg border border-pink-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-lg font-bold bg-pink-100">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-pink-800">{member.name}</h3>
                    <p className="text-sm text-pink-600">{member.birthday}</p>
                    {member.daysUntil === 0 ? (
                      <Badge className="bg-green-500 text-white text-xs">🎉 Happy Birthday Today!</Badge>
                    ) : member.daysUntil === 1 ? (
                      <Badge className="bg-orange-500 text-white text-xs">🎂 Birthday Tomorrow!</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-white text-xs">🎂 {member.daysUntil} days</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  
                  {/* Simple Birthday Display - Impossible to Miss */}
                  <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                    🎂 {member.birthday}
                  </p>
                  
                  {/* Birthday Section - Made More Prominent */}
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-2">
                    <p className="text-sm font-bold text-blue-800 mb-1">🎂 BIRTHDAY</p>
                    <p className="text-base font-bold text-blue-900">{member.birthday}</p>
                    {(() => {
                      const daysUntil = getDaysUntilBirthday(member.birthday);
                      if (daysUntil === 0) {
                        return (
                          <Badge className="bg-green-500 text-white text-xs mt-2 px-2 py-1">
                            🎉 TODAY!
                          </Badge>
                        );
                      } else if (daysUntil === 1) {
                        return (
                          <Badge className="bg-orange-500 text-white text-xs mt-2 px-2 py-1">
                            🎂 TOMORROW!
                          </Badge>
                        );
                      } else if (daysUntil <= 7) {
                        return (
                          <Badge className="bg-yellow-500 text-white text-xs mt-2 px-2 py-1">
                            {daysUntil} DAYS
                          </Badge>
                        );
                      } else {
                        return (
                          <Badge variant="outline" className="text-blue-600 border-blue-400 text-xs mt-2 px-2 py-1 font-bold">
                            {daysUntil} DAYS
                          </Badge>
                        );
                      }
                    })()}
                  </div>
                  
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
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      </div>
    </>
  );
}
