'use client'
import { useState } from 'react'

export default function ProductCard({ name, price, flavors }) {
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0])

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 w-64 flex flex-col gap-3 hover:border-orange-500 transition-all">
      <div className="bg-gray-800 rounded-xl h-48 flex items-center justify-center">
        <span className="text-gray-500 text-sm">No Image Yet</span>
      </div>


      <h2 className="text-white font-bold text-lg">{name}</h2>
      <p className="text-orange-400 font-semibold text-xl">₹{price}</p>
      <div className="flex flex-wrap gap-2">


        {flavors.map(flavor => (
          <button
            key={flavor}
            onClick={() => setSelectedFlavor(flavor)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedFlavor === flavor 
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {flavor}
          </button>
        ))}
      </div>


      <p className="text-gray-400 text-sm">Selected: {selectedFlavor}</p>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition-all">
        Add to Cart
      </button>
    </div>
  )
}