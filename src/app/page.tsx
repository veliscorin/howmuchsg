'use client';

import { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import Image from 'next/image';
import LoginModal from '../components/LoginModal';
import { handleSubmit } from '../utils/submitHandler';
import { handleCompare } from '../utils/compareHandler';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [item, setItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [avgResult, setAvgResult] = useState<string | null>(null);
  const [avgResultColor, setAvgResultColor] = useState('black');
  const [medianResult, setMedianResult] = useState<string | null>(null);
  const [medianResultColor, setMedianResultColor] = useState('black');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (item && item.length > 2) {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setModalIsOpen(true); // Show the login modal if the user is not logged in
    } else {
      await handleSubmit(e, item, price, quantity, unit, setAvgResult, setAvgResultColor);
    }
  };

  const handleCompareClick = async () => {
    if (!user) {
      setModalIsOpen(true); // Show the login modal if the user is not logged in
    } else {
      await handleCompare(
        item,
        price,
        quantity,
        unit,
        setAvgResult,
        setAvgResultColor,
        setMedianResult,
        setMedianResultColor
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg flex justify-between items-center p-4">
        <div className="flex-shrink-0">
          <Image
            src="/images/howmuch-v1.png"
            alt="howmuchsg logo"
            width={100}
            height={33}
          />
        </div>

        {user && (
          <div className="flex flex-col items-center space-y-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User profile"
                className="rounded-full border border-gray-300 w-10"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              onClick={handleLogout}
              className="text-red-500 cursor-pointer"
            >
              Logout
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmitClick}
          autoComplete='off'
        >
          <label className="w-full mb-2 text-lg">
            Item:
            <Combobox value={item} onChange={(value) => setItem(value ?? '')}>
              <div className="relative">
                <ComboboxInput
                  className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                  onChange={(e) => setItem(e.target.value)}
                  displayValue={(item: string) => item}
                  required
                  placeholder="e.g., beef"
                />
                {suggestions.length > 0 && (
                  <ComboboxOptions className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                      <ComboboxOption
                        key={index}
                        value={suggestion}
                        className={({ active }) =>
                          `cursor-pointer select-none p-2 ${active ? 'bg-blue-500 text-white' : 'text-black'}`
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
              </select>
            </div>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCompareClick}
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

        <div>
          {avgResult && (
            <div
              className={`mt-4 text-center ${avgResultColor}`} // Class for average result
              dangerouslySetInnerHTML={{ __html: avgResult }}
            />
          )}
          {medianResult && (
            <div
              className={`mt-4 text-center ${medianResultColor}`} // Class for median result
              dangerouslySetInnerHTML={{ __html: medianResult }}
            />
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} />
    </div>
  );
}
