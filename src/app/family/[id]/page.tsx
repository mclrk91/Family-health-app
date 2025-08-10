import SimpleFamilyMemberPage from '@/components/SimpleFamilyMemberPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function FamilyMemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return <SimpleFamilyMemberPage memberId={id} />;
}


