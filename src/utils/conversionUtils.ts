// src/utils/conversionUtils.ts

// Conversion factors for weight units to grams
export const unitConversion: { [key: string]: number } = {
    g: 1,         // grams are the base unit
    kg: 1000,     // 1 kg = 1000 g
    lb: 453.592,  // 1 lb = 453.592 g
  };
  
  // Function to convert any quantity to grams based on the unit provided
  export const convertToGrams = (quantity: number, unit: string): number => {
    // Check if the unit exists in the conversion object
    if (unit in unitConversion) {
      return quantity * unitConversion[unit];
    }
  
    // Handle unrecognized units
    console.warn(`Unrecognized unit: ${unit}. Returning the original quantity without conversion.`);
    return quantity; // Or throw an error if you prefer
  };
  