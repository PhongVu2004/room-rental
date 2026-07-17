import { useState } from 'react';

export default function FilterBar({ onFilter }: { onFilter: (filters: any) => void }) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-end mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          type="text" 
          placeholder="Room name, address..." 
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="w-32">
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
        <input 
          type="number" 
          placeholder="VND" 
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
      </div>
      <div className="w-32">
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
        <input 
          type="number" 
          placeholder="VND" 
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
        Filter
      </button>
    </form>
  );
}
