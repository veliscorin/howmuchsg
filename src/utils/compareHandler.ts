// src/utils/compareHandler.ts
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary

export const handleCompare = async (
  item: string,
  price: string,
  quantity: string,
  unit: string,  // New parameter for the unit
  setResult: (message: string) => void,
  setResultColor: (color: string) => void
) => {
  try {
    // Updated query to include both itemName and unit
    const q = query(
      collection(db, 'items'),
      where('itemName', '==', item),
      where('unit', '==', unit)
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setResult('No historical data found for this item with the specified unit.');
      setResultColor('blue');
      return;
    }

    let totalCost = 0;
    let totalQuantity = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const docPrice = data.price;
      const docQuantity = data.quantity;

      // Ensure docQuantity is a string
      let quantityValue: number;
      let quantityUnit: string;

      if (typeof docQuantity === 'string') {
        // Split the quantity into numeric value and unit
        [quantityValue, quantityUnit] = docQuantity.split(' ');
      } else {
        // Handle if quantity is not a string (e.g., directly a number)
        quantityValue = Number(docQuantity);
        quantityUnit = 'g'; // Default unit
      }

      // Convert quantities to a common unit if necessary
      let convertedQuantity = quantityValue;
      if (quantityUnit !== unit) {
        // Add unit conversion logic here if needed
        if (quantityUnit === 'kg' && unit === 'g') {
          convertedQuantity *= 1000; // Convert kilograms to grams
        } else if (quantityUnit === 'g' && unit === 'kg') {
          convertedQuantity /= 1000; // Convert grams to kilograms
        }
        // Add more conversions as necessary (liters, milliliters, etc.)
      }

      totalCost += docPrice;
      totalQuantity += convertedQuantity;
    });

    const averageCostPerUnit = totalCost / totalQuantity;
    const currentCostPerUnit = parseFloat(price) / parseFloat(quantity);

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
