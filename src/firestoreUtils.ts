// src/firestoreUtils.ts

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Ensure the path is correct

export const addItem = async (item: string, price: number, quantity: string) => {
  try {
    await setDoc(doc(db, 'items', item), {
      price,
      quantity,
      timestamp: new Date()
    });
    console.log('Document successfully written!');
  } catch (e) {
    console.error('Error writing document: ', e);
  }
};
