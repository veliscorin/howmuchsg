import { NextResponse } from 'next/server';
import { parseInput } from '../../../utils/parseInput';  // Make sure the path is correct.

export async function POST(request: Request) {
  const { price, quantity, item } = await request.json();

  const parsedData = parseInput(price, quantity, item);
  if (!parsedData) {
    return NextResponse.json({ success: false, message: 'Invalid input format.' });
  }

  // Assume the static value for comparison
  const staticPricePerGram = 0.05;  // Equivalent to $5 for 100g
  const inputPricePerGram = parsedData.price / parsedData.quantity;

  let message = '';
  let color = 'black';

  if (inputPricePerGram > staticPricePerGram) {
    message = `Pricier at $${inputPricePerGram.toFixed(2)} per gram`;
    color = 'red';
  } else if (inputPricePerGram < staticPricePerGram) {
    message = `Cheaper at $${inputPricePerGram.toFixed(2)} per gram`;
    color = 'green';
  } else {
    message = `Same price at $${inputPricePerGram.toFixed(2)} per gram`;
  }

  return NextResponse.json({ success: true, message, color });
}
