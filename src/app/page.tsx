'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct path

export default function Page() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [item, setItem] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState('black');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      await addDoc(collection(db, 'items'), {
        itemName: item,
        price: parseFloat(price),
        quantity,
        timestamp: new Date()
      });
      setResult('Item added successfully!');
      setResultColor('green');
    } catch (e) {
      console.error('Error adding document: ', e);
      setResult('Failed to add item.');
      setResultColor('red');
    }
  };
  

  const handleCompare = async () => {
    try {
      const q = query(collection(db, 'items'), where('itemName', '==', item));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setResult('No historical data found for this item.');
        setResultColor('blue');
        return;
      }
  
      let totalCost = 0;
      let totalQuantity = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const price = data.price;
        const quantity = parseFloat(data.quantity.replace(/[^0-9.]/g, ''));
        
        // Convert quantities to a common unit if necessary (e.g., all to grams)
        totalCost += price;
        totalQuantity += quantity;
      });
  
      const averageCostPerUnit = totalCost / totalQuantity;
      const currentCostPerUnit = parseFloat(price) / parseFloat(quantity.replace(/[^0-9.]/g, ''));
  
      if (currentCostPerUnit > averageCostPerUnit) {
        setResult(`Pricier at $${currentCostPerUnit.toFixed(2)} per unit compared to average $${averageCostPerUnit.toFixed(2)} per unit`);
        setResultColor('red');
      } else if (currentCostPerUnit < averageCostPerUnit) {
        setResult(`Cheaper at $${currentCostPerUnit.toFixed(2)} per unit compared to average $${averageCostPerUnit.toFixed(2)} per unit`);
        setResultColor('green');
      } else {
        setResult(`Same price at $${currentCostPerUnit.toFixed(2)} per unit compared to average $${averageCostPerUnit.toFixed(2)} per unit`);
        setResultColor('black');
      }
    } catch (error) {
      console.error('Error fetching documents: ', error);
      setResult('An error occurred. Please try again later.');
      setResultColor('black');
    }
  };  

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center mb-4 text-black">HowMuch</h1>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
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
            onClick={handleCompare}
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
