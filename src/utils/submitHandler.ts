import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { convertToGrams, unitConversion } from './conversionUtils'; // Import utilities

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

        let newAvgPrice = parsedPrice / normalizedQuantity;

        if (uniqueItemDoc.exists()) {
            const data = uniqueItemDoc.data();
            const currentAvgPrice = data.avgPrice || 0;
            const currentCount = data.count || 0;

            // Calculate the new average price per gram
            newAvgPrice = ((currentAvgPrice * currentCount) + (parsedPrice / normalizedQuantity)) / (currentCount + 1);

            // Update the uniqueItems collection with the new average price and count
            await updateDoc(uniqueItemsRef, {
                avgPrice: newAvgPrice,
                count: currentCount + 1,
                unit: 'g', // Always store the normalized unit as grams
                searchKeywords: keywords,
            });
        } else {
            // Create a new document if it doesn't exist
            await setDoc(uniqueItemsRef, {
                name: item.toLowerCase(),
                avgPrice: newAvgPrice,
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
