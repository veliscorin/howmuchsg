'use client';

import { useState } from 'react';
import { handleSubmit } from '../utils/submitHandler'; // Adjust the path as necessary
import { handleCompare } from '../utils/compareHandler'; // Adjust the path as necessary

export default function Page() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [item, setItem] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState('black');

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center mb-4 text-black">HowMuch</h1>
      <form className="flex flex-col items-center" onSubmit={(e) => handleSubmit(e, item, price, quantity, setResult, setResultColor)}>
        <label className="w-full mb-2 text-lg">
          Item:
          <input
            type="text"
            placeholder="e.g., beef"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </label>
        <label className="w-full mb-2 text-lg">
          Price ($):
          <input
            type="text"
            placeholder="e.g., 5.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </label>
        <label className="w-full mb-4 text-lg">
          Quantity:
          <input
            type="text"
            placeholder="e.g., 100g or 0.5kg"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </label>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 mb-4 border border-gray-300 rounded bg-blue-500 text-white"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => handleCompare(item, price, quantity, setResult, setResultColor)}
            className="px-4 py-2 mb-4 border border-gray-300 rounded bg-gray-200 text-black"
          >
            Compare
          </button>
        </div>
      </form>
      {result && <div className="mt-4 text-center" style={{ color: resultColor }}>{result}</div>}
    </div>
  );
}
