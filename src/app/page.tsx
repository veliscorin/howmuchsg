'use client';

import { Cormorant_Garamond } from "next/font/google";
import { useState } from 'react';
import { handleSubmit } from '../utils/submitHandler'; // Adjust the path as necessary
import { handleCompare } from '../utils/compareHandler'; // Adjust the path as necessary
import Image from 'next/image'; // Import the Image component

// Import and define the Cormorant Garamond font
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
});

export default function Page() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g'); // Default unit to grams
  const [item, setItem] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState('black');

  return (
    <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center">
      
      {/* Replace the h1 with the logo */}
      <Image
        src="/images/howmuch-v1.png"
        alt="howmuchsg logo"
        width={150}  // Set the desired width
        height={50}  // Set the desired height
        className="mb-4" // Add margin-bottom for spacing
      />
      
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => handleSubmit(e, item, price, quantity, unit, setResult, setResultColor)}
      >
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
        <label className="w-full mb-8 text-lg">
          Quantity:
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded bg-white text-black"
            >
              <option value="g">grams (g)</option>
              <option value="kg">kilograms (kg)</option>
              <option value="ml">millilitres (ml)</option>
              <option value="l">litres (l)</option>
              <option value="oz">ounces (oz)</option>
              <option value="lb">pounds (lb)</option>
              <option value="pcs">pieces (pcs)</option>
              <option value="packs">packs</option>
            </select>
          </div>
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleCompare(item, price, quantity, unit, setResult, setResultColor)}
            className="border border-gray-300 compare-button w-28"
          >
            Compare
          </button>
          <button
            type="submit"
            className="border border-red-300 submit-button w-28"
          >
            Submit
          </button>
        </div>

      </form>
      {result && <div className="mt-4 text-center" style={{ color: resultColor }}>{result}</div>}
    </div>
  );
}
