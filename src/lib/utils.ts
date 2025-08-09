import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFamilyMemberPhoto(name: string): string {
  const photoMap: { [key: string]: string } = {
    'Marissa': '/family-photos/marissa.jpg',
    'Jack': '/family-photos/jack.jpg',
    'Mike': '/family-photos/mike.jpg',
    'Tonya': '/family-photos/tonya.jpg',
    'Brandon': '/family-photos/brandon.jpg',
    'Bentley': '/family-photos/bentley.jpg',
  };

  return photoMap[name] || '';
}

export function getFamilyMemberPhotoStyle(name: string): string {
  const styleMap: { [key: string]: string } = {
    'Tonya': 'object-cover object-top', // Position photo from the top to avoid cutting off head
    'Marissa': 'object-cover',
    'Jack': 'object-cover',
    'Mike': 'object-cover',
    'Brandon': 'object-cover',
    'Bentley': 'object-cover',
  };

  return styleMap[name] || 'object-cover';
}
