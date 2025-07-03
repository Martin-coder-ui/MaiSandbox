// src/pages/SeasonalCarousel.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const seasons = [
  {
    name: "Spring Essentials",
    description: "Light layers, pastel tones, skincare for the shift to warmth.",
    items: [
      { id: 1, name: "Pastel Windbreaker", tag: "eco", price: "£49" },
      { id: 2, name: "Moisturising Day Cream", tag: "vegan", price: "£22" },
    ],
  },
  {
    name: "Summer Essentials",
    description: "Stay cool with breathable fabrics and sun-safe care.",
    items: [
      { id: 3, name: "Linen Shirt", tag: "recycled", price: "£35" },
      { id: 4, name: "Mineral Sunscreen SPF 30", tag: "vegan", price: "£18" },
    ],
  },
  {
    name: "Autumn Essentials",
    description: "Earth tones, warmth, and skin repair after summer.",
    items: [
      { id: 5, name: "Knit Scarf", tag: "organic", price: "£28" },
      { id: 6, name: "Vitamin C Serum", tag: "vegan", price: "£24" },
    ],
  },
  {
    name: "Winter Essentials",
    description: "Warmth, layering, and hydration to combat cold air.",
    items: [
      { id: 7, name: "Thermal Base Layer", tag: "eco", price: "£42" },
      { id: 8, name: "Hydrating Face Mask", tag: "cruelty-free", price: "£20" },
    ],
  },
];

const SeasonalCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const season = seasons[index];

  const next = () => setIndex((index + 1) % seasons.length);
  const prev = () => setIndex((index - 1 + seasons.length) % seasons.length);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🌀 Seasonal Style Carousel</h1>
      <div className="flex justify-center items-center gap-4 mb-6">
        <button onClick={prev} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-semibold">{season.name}</h2>
        <button onClick={next} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ChevronRight />
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{season.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {season.items.map((item) => (
          <div key={item.id} className="border p-4 rounded-xl shadow-sm dark:border-gray-700">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tag: {item.tag}</p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalCarousel;
