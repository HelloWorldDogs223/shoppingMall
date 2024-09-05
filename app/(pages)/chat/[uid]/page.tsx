'use client';

import Chat from '@/app/components/Chat';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();

  return <Chat params={params} />;
}
