import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-responsive mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">Ebonidating</h1>
        </div>
      </header>
      <main className="container-responsive mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center text-amber-800 mb-8">
          Welcome to Ebonidating
        </h2>
      </main>
    </div>
  );
}
