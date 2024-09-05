'use client';

import Chat from '@/app/components/Chat';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
}
