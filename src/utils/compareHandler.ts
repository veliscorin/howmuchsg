import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary

export const handleCompare = async (
  item: string,
  price: string,
  quantity: string,
  setResult: (message: string) => void,
  setResultColor: (color: string) => void
) => {
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
      const docPrice = data.price;
      const docQuantity = parseFloat(data.quantity.replace(/[^0-9.]/g, ''));
      
      totalCost += docPrice;
      totalQuantity += docQuantity;
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
