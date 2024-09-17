'use client';

export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
        <h1 className="mt-4 text-3xl font-bold text-gray-900">점검 중</h1>
        <p className="mt-2 text-lg text-gray-600">
          현재 시스템 점검 중입니다. 불편을 드려 죄송합니다.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          빠른 시일 내에 서비스를 정상화하도록 하겠습니다.
        </p>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
