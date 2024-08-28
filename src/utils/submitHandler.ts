// src/utils/submitHandler.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary

export const handleSubmit = async (
    event: React.FormEvent,
    item: string,
    price: string,
    quantity: string,
    unit: string,  // Unit parameter remains
    setResult: (message: string) => void,
    setResultColor: (color: string) => void
    ) => {
    event.preventDefault();

    try {
        await addDoc(collection(db, 'items'), {
        itemName: item,
        price: parseFloat(price),
        quantity: parseFloat(quantity),  // Store quantity as a number
        unit: unit,                      // Store unit separately
        timestamp: new Date(),
        });
        setResult('Item added successfully!');
        setResultColor('green');
    } catch (e) {
        console.error('Error adding document: ', e);
        setResult('Failed to add item.');
        setResultColor('red');
    }
};