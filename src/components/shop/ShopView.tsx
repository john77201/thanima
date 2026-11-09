import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Grid as GridIcon,
  List as ListIcon,
  Search,
  Star,
  ChevronDown,
  X,
  RotateCcw,
} from 'lucide-react';
import { Category, CategoryId, Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/pricing';

interface ShopViewProps {
  initialCategory?: CategoryId | 'all';
  searchFilter?: string;
  onSelectProduct: (product: Product) => void;
  onNavigateCategory: (catId: CategoryId) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialCategory = 'all',
  searchFilter = '',
  onSelectProduct,
  onNavigateCategory,
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(searchFilter);
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // Active Category details if one is selected
  const currentCategoryData = categories.find((c) => c.id === selectedCategory);

  // Available subcategories for the selected category
  const availableSubcategories = currentCategoryData ? currentCategoryData.subcategories : [];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && !p.categoryIds.includes(selectedCategory)) {
          return false;
        }
        // Subcategory filter
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchMal = p.malayalamName.includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSub = p.subcategory?.toLowerCase().includes(q);
          if (!matchName && !matchMal && !matchDesc && !matchSub) return false;
        }
        // Price filter
        const lowestPrice = Math.min(...p.variants.map((v) => v.price));
        if (lowestPrice > maxPrice) return false;
        // Rating filter
        if (minRating > 0 && p.rating < minRating) return false;
        // Availability
        if (inStockOnly && !p.variants.some((v) => v.stock > 0)) return false;
        // Veg filter
        if (vegOnly && !p.isVeg) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;

        switch (sortBy) {
          case 'popularity':
            return b.salesCount - a.salesCount;
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'newest':
            return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    maxPrice,
    minRating,
    inStockOnly,
    vegOnly,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setMaxPrice(1200);
    setMinRating(0);
    setInStockOnly(false);
    setVegOnly(false);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Category Banner if category view */}
      {currentCategoryData ? (
        <div className="mb-8 p-6 md:p-8 bg-gradient-to-r from-[#1F4D2B] to-[#14381F] text-[#FFF8E7] rounded-3xl relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2A900] bg-white/10 px-2 py-0.5 rounded-xs">
              Category Showcase
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              {currentCategoryData.name}
            </h1>
            <p className="font-malayalam text-lg text-[#F2A900] font-semibold mt-0.5">
              {currentCategoryData.malayalamName}
            </p>
            <p className="text-xs text-[#FFF8E7]/80 mt-2 leading-relaxed">
              {currentCategoryData.description}
            </p>

            {/* Subcategory Chips */}
            {availableSubcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                    selectedSubcategory === 'all'
                      ? 'bg-[#F2A900] text-[#1F4D2B] font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All {currentCategoryData.name}
                </button>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                      selectedSubcategory === sub
                        ? 'bg-[#F2A900] text-[#1F4D2B] font-bold'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A2C17]">
            Kerala Homely Delicacies
          </h1>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Browse all 80+ authentic homemade items, stone-ground flours, and aged pickles.
          </p>
        </div>
      )}

      {/* Controls Bar: Search, Filters toggle, Sorting, View toggle */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Mobile filter button & Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FFF8E7] text-[#1F4D2B] rounded-xl text-xs font-semibold border border-[#F2A900]/30"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-[#8C7A6B]">
            Showing <strong className="text-[#4A2C17]">{filteredProducts.length}</strong> delicacies
          </span>
        </div>

        {/* Right: Search + Sort dropdown + Grid/List */}
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          {/* Quick filter search */}
          <div className="relative hidden sm:block w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter list..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#F9F7F1] border border-[#EFE8D8] rounded-xl focus:outline-none focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="hidden md:inline text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F9F7F1] border border-[#EFE8D8] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-[#F9F7F1] p-1 rounded-xl border border-[#EFE8D8]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-[#1F4D2B]' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-2xs text-[#1F4D2B]' : 'text-slate-400'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`w-full md:w-64 bg-white border border-[#EFE8D8] rounded-3xl p-5 shadow-xs space-y-6 shrink-0 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8D8]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#4A2C17] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#1F4D2B]" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#1F4D2B] hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter List */}
          <div>
            <label className="block text-xs font-bold text-[#4A2C17] uppercase tracking-wider mb-2">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#1F4D2B] text-white font-bold'
                    : 'text-[#4A2C17] hover:bg-[#F4F1EA]'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-70">({products.length})</span>
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setSelectedSubcategory('all');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-[#1F4D2B] text-white font-bold'
                      : 'text-[#4A2C17] hover:bg-[#F4F1EA]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] font-malayalam opacity-80 shrink-0">
                    {c.malayalamName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#4A2C17] uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#1F4D2B] tabular-nums">
                {formatINR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={1500}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1F4D2B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹60</span>
              <span>₹1,500</span>
            </div>
          </div>

          {/* Dietary & Stock Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#EFE8D8]">
            <label className="flex items-center gap-2 text-xs text-[#4A2C17] cursor-pointer">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded-sm text-[#1F4D2B] focus:ring-[#1F4D2B]"
              />
              <span className="font-medium">100% Vegetarian Only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[#4A2C17] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-sm text-[#1F4D2B] focus:ring-[#1F4D2B]"
              />
              <span className="font-medium">Exclude Out of Stock</span>
            </label>
          </div>

          {/* Rating Filter */}
          <div className="pt-2 border-t border-[#EFE8D8]">
            <label className="block text-xs font-bold text-[#4A2C17] uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-1">
              {[4, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                    minRating === r
                      ? 'bg-[#F2A900] text-[#1F4D2B] border-[#F2A900]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{r}+</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid / List */}
        <div className="flex-1 w-full">
          {paginatedProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white border border-[#EFE8D8] rounded-3xl p-8 space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-bold text-base text-[#4A2C17]">No delicacies matched your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price limit or clearing specific search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-xl hover:bg-[#14381F]"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-[#1F4D2B] text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
