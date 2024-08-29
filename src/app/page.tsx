'use client';

import { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Image from 'next/image';
import { handleSubmit } from '../utils/submitHandler';
import { handleCompare } from '../utils/compareHandler';

export default function Page() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g'); 
  const [item, setItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState('black');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (item && item.length > 2) { // Ensure item is not null or undefined
        const q = query(
          collection(db, 'uniqueItems'),
          where('searchKeywords', 'array-contains', item.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => doc.data().name);

        setSuggestions(items);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [item]);

  return (
    <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/images/howmuch-v1.png"
        alt="howmuchsg logo"
        width={150}  
        height={50}  
        className="mb-4" 
      />
      
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => handleSubmit(e, item, price, quantity, unit, setResult, setResultColor)}
      >
        <label className="w-full mb-2 text-lg">
          Item:
          <Combobox value={item} onChange={(value) => setItem(value ?? '')}>
            <div className="relative">
              <ComboboxInput
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                onChange={(e) => setItem(e.target.value)}
                displayValue={(item: string) => item}
                placeholder="e.g., beef"
              />
              {suggestions.length > 0 && (
                <ComboboxOptions className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <ComboboxOption
                      key={index}
                      value={suggestion}
                      className={({ active }) =>
                        `cursor-pointer select-none p-2 ${
                          active ? 'bg-blue-500 text-white' : 'text-black'
                        }`
                      }
                    >
                      {suggestion}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              )}
            </div>
          </Combobox>
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
              <option value="lb">pounds (lb)</option>
              {/*
              <option value="ml">millilitres (ml)</option>
              <option value="l">litres (l)</option>
              <option value="oz">ounces (oz)</option>
              <option value="pcs">pieces (pcs)</option>
              <option value="packs">packs</option>
              */}
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
