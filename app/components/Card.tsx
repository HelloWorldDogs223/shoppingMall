'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Card() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/product/1')}
      className="cursor-pointer flex flex-col gap-3 pb-3"
    >
      <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
        <Image
          src="/exampleCloth.png"
          width={176}
          height={176}
          alt="product page"
        />
      </div>
      <div>
        <p className="text-[#0e141b] text-base font-medium leading-normal">
          Silk Blouse
        </p>
        <p className="text-[#4f7396] text-sm font-normal leading-normal">
          $120
        </p>
      </div>
    </div>
  );
}
