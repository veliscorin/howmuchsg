import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { convertToGrams, unitConversion } from './conversionUtils'; // Import utilities

export const handleCompare = async (
  item: string,
  price: string,
  quantity: string,
  unit: string,  // Unit of the current item
  setResult: (message: string) => void,
  setResultColor: (color: string) => void
) => {
  try {
    // Convert the submitted quantity to grams
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);
    const normalizedQuantity = convertToGrams(parsedQuantity, unit);
    const currentCostPerGram = parsedPrice / normalizedQuantity;

    // Fetch the average price per gram from the uniqueItems collection
    const uniqueItemDoc = await getDoc(doc(db, 'uniqueItems', item.toLowerCase()));

    if (!uniqueItemDoc.exists()) {
      setResult('No historical data found for this item.');
      setResultColor('blue');
      return;
    }

    const data = uniqueItemDoc.data();
    const averageCostPerGram = data.avgPrice || 0;

    if (currentCostPerGram > averageCostPerGram) {
      setResult(`Pricier at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`);
      setResultColor('red');
    } else if (currentCostPerGram < averageCostPerGram) {
      setResult(`Cheaper at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`);
      setResultColor('green');
    } else {
      setResult(`Same price at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`);
      setResultColor('black');
    }
  } catch (error) {
    console.error('Error fetching document: ', error);
    setResult('An error occurred. Please try again later.');
    setResultColor('black');
  }
};
