import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Sparkles, 
  Calendar, 
  Phone, 
  ArrowUpDown, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { Product } from '../types';

export const MarketplacePage: React.FC = () => {
  const { 
    products, 
    setActiveModal, 
    setActiveProductForDetails, 
    currentUser, 
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating' | 'freshness'>('distance');
  const [onlySurplus, setOnlySurplus] = useState<boolean>(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Tubers', 'Grains & Cereals', 'Pulses'];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tamilName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase());

        // Category
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

        // Surplus
        const matchesSurplus = !onlySurplus || p.isSurplus;

        return matchesSearch && matchesCategory && matchesSurplus;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.expectedPrice - b.expectedPrice;
        if (sortBy === 'rating') return b.farmerRating - a.farmerRating;
        if (sortBy === 'freshness') return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        return 0; // Default distance preservation
      });
  }, [products, searchQuery, selectedCategory, maxDistanceKm, sortBy, onlySurplus]);

  const handleOpenProduct = (product: Product) => {
    setActiveProductForDetails(product);
    setActiveModal('product-details');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'ta' ? 'நேரடி விவசாய சந்தை' : 'Direct Agricultural Marketplace'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connecting Tamil Nadu farmers directly with consumers, hotels, restaurants, and retail shops
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('post-requirement')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            + Post Purchase Requirement
          </button>
          <button
            onClick={() => setActiveModal('add-product')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            + List Produce as Farmer
          </button>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vegetables, fruits, crops, or district (e.g. Tomato, Madurai, Onion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-auto"
            >
              <option value="distance">Proximity / Distance</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Farmer Rating</option>
              <option value="freshness">Freshness / Recent Harvest</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Surplus Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={onlySurplus}
              onChange={(e) => setOnlySurplus(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>⚡ Only Surplus Produce Deals</span>
          </label>
        </div>
      </div>

      {/* Product Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top Media */}
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="bg-slate-950/80 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {product.category}
                  </span>
                  {product.isSurplus && (
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow">
                      Surplus (25% Off)
                    </span>
                  )}
                </div>

                {/* Bottom on Image info */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <h3 className="font-black text-lg text-white leading-tight">{product.name}</h3>
                    <span className="text-xs text-emerald-200 font-medium">{product.tamilName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xl text-amber-300">₹{product.expectedPrice}</span>
                    <span className="text-[10px] text-slate-200"> / {product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-4 space-y-2.5 text-xs">
                {/* Farmer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{product.farmerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {product.farmerRating}★
                  </span>
                </div>

                {/* Location & Quantity */}
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {product.location}
                  </span>
                  <span className="font-semibold text-slate-700">
                    Stock: {product.quantity} {product.unit}
                  </span>
                </div>

                {/* AI Fair Price Tag */}
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-950 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>AI Fair Price:</span>
                  </div>
                  <span className="font-bold text-emerald-800 text-[11px]">
                    ₹{product.aiFairPriceMin}–₹{product.aiFairPriceMax}/{product.unit}
                  </span>
                </div>

                {/* Harvest Date */}
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Harvest: {product.harvestDate}</span>
                  <span>Available: {product.availableFrom}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpenProduct(product)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition text-center"
              >
                View Details
              </button>
              <button
                onClick={() => handleOpenProduct(product)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition text-center shadow-xs"
              >
                Direct Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            No farm produce found matching your current filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlySurplus(false);
            }}
            className="mt-3 text-xs text-emerald-700 font-bold underline"
          >
            Reset Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
