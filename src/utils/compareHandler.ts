import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { convertToGrams } from './conversionUtils'; // Import utilities

export const handleCompare = async (
  item: string,
  price: string,
  quantity: string,
  unit: string,  // Unit of the current item
  setAvgResult: (message: string) => void,
  setAvgResultColor: (color: string) => void,
  setMedianResult: (message: string) => void,
  setMedianResultColor: (color: string) => void
) => {
  try {
    // Convert the submitted quantity to grams
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);
    const normalizedQuantity = convertToGrams(parsedQuantity, unit);
    const currentCostPerGram = parsedPrice / normalizedQuantity;

    // Fetch the average price per gram and median price from the uniqueItems collection
    const uniqueItemDoc = await getDoc(doc(db, 'uniqueItems', item.toLowerCase()));

    if (!uniqueItemDoc.exists()) {
      setAvgResult('No historical data found for this item.');
      setAvgResultColor('blue');
      setMedianResult('No historical data found for this item.');
      setMedianResultColor('blue');
      return;
    }

    const data = uniqueItemDoc.data();
    const averageCostPerGram = data.avgPrice || 0;
    const medianCostPerGram = data.medianPrice || 0; // Assuming you have stored the median price

    // Construct average comparison message
    let avgMessage = '';
    let avgComparisonClass = '';

    if (currentCostPerGram > averageCostPerGram) {
      avgMessage = `Pricier at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`;
      avgComparisonClass = 'red-box'; // Class for pricier
    } else if (currentCostPerGram < averageCostPerGram) {
      avgMessage = `Cheaper at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`;
      avgComparisonClass = 'green-box'; // Class for cheaper
    } else {
      avgMessage = `Same price at $${currentCostPerGram.toFixed(2)} per gram compared to average $${averageCostPerGram.toFixed(2)} per gram.`;
      avgComparisonClass = 'black-box'; // Neutral class
    }

    // Construct median comparison message
    let medianMessage = '';
    let medianComparisonClass = '';

    if (currentCostPerGram > medianCostPerGram) {
      medianMessage = `Pricier than median price at $${medianCostPerGram.toFixed(2)} per gram.`;
      medianComparisonClass = 'red-box'; // Class for pricier
    } else if (currentCostPerGram < medianCostPerGram) {
      medianMessage = `Cheaper than median price at $${medianCostPerGram.toFixed(2)} per gram.`;
      medianComparisonClass = 'green-box'; // Class for cheaper
    } else {
      medianMessage = `Same price as median price at $${medianCostPerGram.toFixed(2)} per gram.`;
      medianComparisonClass = 'black-box'; // Neutral class
    }

    // Set results and colors for both average and median comparisons
    setAvgResult(avgMessage);
    setAvgResultColor(avgComparisonClass);
    setMedianResult(medianMessage);
    setMedianResultColor(medianComparisonClass);
  } catch (error) {
    console.error('Error fetching document: ', error);
    setAvgResult('An error occurred. Please try again later.');
    setAvgResultColor('black');
    setMedianResult('An error occurred. Please try again later.');
    setMedianResultColor('black');
  }
};
