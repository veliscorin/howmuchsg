import { collection, addDoc, doc, getDoc, updateDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { convertToGrams, unitConversion } from './conversionUtils'; // Import utilities

// Function to calculate median
const calculateMedian = (prices: number[]): number => {
    const sortedPrices = prices.sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);

    return sortedPrices.length % 2 !== 0
        ? sortedPrices[mid]
        : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
};

// Function to calculate average
const calculateAverage = (prices: number[], count: number): number => {
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / count;
};

export const handleSubmit = async (
    event: React.FormEvent,
    item: string,
    price: string,
    quantity: string,
    unit: string,
    setResult: (message: string) => void,
    setResultColor: (color: string) => void
) => {
    event.preventDefault();

    try {
        const parsedPrice = parseFloat(price);
        const parsedQuantity = parseFloat(quantity);
        const normalizedQuantity = convertToGrams(parsedQuantity, unit);
        const keywords = generateSearchKeywords(item.toLowerCase());
        const uniqueItemsRef = doc(db, 'uniqueItems', item.toLowerCase());

        const uniqueItemDoc = await getDoc(uniqueItemsRef);

        let allPrices: number[] = [parsedPrice / normalizedQuantity]; // Start with the current price

        if (uniqueItemDoc.exists()) {
            const data = uniqueItemDoc.data();
            const currentCount = data.count || 0;

            // Fetch all previous prices for the item
            const itemsQuery = query(collection(db, 'items'), where('itemName', '==', item));
            const querySnapshot = await getDocs(itemsQuery);

            querySnapshot.forEach((doc) => {
                const itemData = doc.data();
                if (itemData.normalizedQuantity && itemData.price) {
                    allPrices.push(itemData.price / itemData.normalizedQuantity); // Add all existing prices
                }
            });

            // Calculate the new average price
            const newAvgPrice = calculateAverage(allPrices, currentCount + 1);

            // Calculate the median price
            const medianPrice = calculateMedian(allPrices);

            // Update the uniqueItems collection with the new average price, count, and median price
            await updateDoc(uniqueItemsRef, {
                avgPrice: newAvgPrice,
                medianPrice: medianPrice,
                count: allPrices.length, // Update the count with the total number of entries
                unit: 'g', // Always store the normalized unit as grams
                searchKeywords: keywords,
            });
        } else {
            // Create a new document if it doesn't exist
            const newAvgPrice = calculateAverage(allPrices, 1);
            const medianPrice = calculateMedian(allPrices);

            await setDoc(uniqueItemsRef, {
                name: item.toLowerCase(),
                avgPrice: newAvgPrice,
                medianPrice: medianPrice,
                count: 1,
                unit: 'g', // Store everything normalized to grams
                searchKeywords: keywords,
            });
        }

        // Add the item to the items collection
        await addDoc(collection(db, 'items'), {
            itemName: item,
            price: parsedPrice,
            quantity: parsedQuantity,
            normalizedQuantity: normalizedQuantity, // Store the normalized quantity for reference
            unit: unit, // Store the original unit for reference
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

// Function to generate search keywords from item name
const generateSearchKeywords = (itemName: string): string[] => {
    const words = itemName.toLowerCase().split(' ');
    const keywords = new Set<string>();

    // Add the full item name
    keywords.add(itemName.toLowerCase());

    // Add each word's substrings starting from 3 characters
    words.forEach(word => {
        let prefix = '';
        for (let i = 0; i < word.length; i++) {
            prefix += word[i];
            if (prefix.length >= 3) {
                keywords.add(prefix);
            }
        }
    });

    // Generate combined prefixes from left to right for the full item name
    let combinedPrefix = '';
    for (let i = 0; i < itemName.length; i++) {
        combinedPrefix += itemName[i];
        if (combinedPrefix.length >= 3) {
            keywords.add(combinedPrefix.toLowerCase());
        }
    }

    return Array.from(keywords);
};
