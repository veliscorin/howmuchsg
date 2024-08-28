'use client';

export default function AboutPage() {
  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center mb-4 text-black">About HowMuch</h1>
      <p className="text-lg text-center text-gray-700">
        Welcome to HowMuch, your go-to app for tracking and comparing prices of items you purchase. Whether you're buying groceries, household items, or any other products, HowMuch helps you keep track of costs and make informed decisions. 
      </p>
      <p className="text-lg text-center text-gray-700 mt-4">
        Our mission is to empower you with knowledge, so you can get the best deals every time you shop. Start comparing and tracking today!
      </p>
    </div>
  );
}
