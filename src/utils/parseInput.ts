// src/utils/parseInput.ts

export interface ParsedInput {
  price: number;
  quantity: number;  // Quantity will always be in grams for comparison.
  item: string;
}

export function parseInput(price: string, quantity: string, item: string): ParsedInput | null {
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber)) {
    return null;  // Invalid price format.
  }

  const regex = /^(\d+(\.\d*)?)\s*(g|kg)$/i;
  const match = quantity.match(regex);
  if (!match) {
    return null;  // Invalid quantity format.
  }

  const amount = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  let quantityInGrams = amount;
  if (unit === 'kg') {
    quantityInGrams = amount * 1000;  // Convert kilograms to grams.
  } else if (unit !== 'g') {
    return null;  // Unrecognized unit.
  }

  return {
    price: priceNumber,
    quantity: quantityInGrams,
    item: item.trim().toLowerCase()
  };
}
