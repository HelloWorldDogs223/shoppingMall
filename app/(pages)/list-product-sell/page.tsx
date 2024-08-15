import ListSell from '@/app/components/ListSell';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <ListSell />
    </Suspense>
  );
}
