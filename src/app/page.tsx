'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    setResult(data.message);
  };

  const handleCompare = async () => {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    setResult(data.message);
  };

  return (
    <>
      <Head>
        <title>HowMuch</title>
      </Head>
      <div className="p-8 max-w-lg mx-auto bg-gray-100 min-h-screen">
        <h1 className="text-4xl text-center mb-4 text-black">HowMuch</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input 
            type="text" 
            placeholder="e.g., 100g of beef at $6" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded bg-white text-black"
          />
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={handleCompare} 
              className="px-4 py-2 border border-gray-300 rounded bg-gray-200 text-black"
            >
              Compare
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 border border-gray-300 rounded bg-blue-500 text-white"
            >
              Submit
            </button>
          </div>
        </form>
        {result && <div className="mt-4 text-center text-black">{result}</div>}
      </div>
    </>
  );
}
