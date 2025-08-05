// src/components/Toolbar.jsx
import React, { useState } from "react";
import { FaFilter, FaSort, FaSearch, FaTimes, FaFire } from "react-icons/fa";

const Toolbar = ({
  searchInput,
  setSearchInput,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  appliedMinPrice,
  appliedMaxPrice,
  appliedCategory,
  setAppliedCategory,
  sortBy,
  setSortBy,
  clearFilters,
  showPopular,
  setShowPopular
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "Smartphones",
    "Laptops & Tablets",
    "Audio & Entertainment",
    "Home Appliances",
    "Accessories & Other Tech"
  ];

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  const togglePopular = () => {
    setShowPopular(!showPopular);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
      {/* Search */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search Products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          className="border px-3 py-2 rounded-xl w-64"
        />
        <button
          onClick={handleSearchSubmit}
          className="bg-cyan-700 text-white px-3 py-2 rounded-xl hover:bg-cyan-800"
        >
          <FaSearch />
        </button>
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-xl flex items-center gap-2"
          >
            <FaTimes /> Clear Search
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap mt-2 sm:mt-0">
        {/* Clear Filters */}
        {(appliedMinPrice || appliedMaxPrice || appliedCategory || sortBy || showPopular) && (
          <button
            onClick={clearFilters}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-xl flex items-center gap-2"
          >
            <FaTimes /> Clear Filters
          </button>
        )}

        {/* Popular Products Button */}
        <button
          onClick={togglePopular}
          className={`px-3 py-2 rounded-xl flex items-center gap-2 ${showPopular 
            ? "bg-orange-600 text-white hover:bg-orange-700" 
            : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <FaFire /> Popular
        </button>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown((prev) => !prev)}
            className="bg-gray-200 px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300"
          >
            Categories: {appliedCategory || "All"}
          </button>
          {showCategoryDropdown && (
            <div className="absolute z-10 mt-2 right-0 bg-white border rounded-lg shadow-lg p-2 w-48">
              <div 
                onClick={() => {
                  setAppliedCategory("");
                  setCurrentPage(1);
                  setShowCategoryDropdown(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded ${!appliedCategory ? 'bg-gray-100' : ''}`}
              >
                All Categories
              </div>
              {categories.map((cat) => (
                <div 
                  key={cat}
                  onClick={() => {
                    setAppliedCategory(cat);
                    setCurrentPage(1);
                    setShowCategoryDropdown(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 rounded ${appliedCategory === cat ? 'bg-gray-100' : ''}`}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className="bg-gray-200 px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300"
          >
            <FaFilter /> Filter
          </button>
          {showFilterDropdown && (
            <div className="absolute z-10 mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 w-64">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border mb-2 px-3 py-2 rounded-xl w-full"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border px-3 py-2 rounded-xl w-full"
              />
              <button
                onClick={applyFilters}
                className="w-full bg-cyan-700 mt-3 text-white px-3 py-2 rounded-xl hover:bg-cyan-800"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown((prev) => !prev)}
            className="bg-gray-200 px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300"
          >
            <FaSort /> Sort
          </button>
          {showSortDropdown && (
            <div className="absolute z-10 mt-2 right-0 bg-white border rounded-lg shadow-lg p-2 w-48">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setShowSortDropdown(false);
                }}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="titleAsc">Title: A to Z</option>
                <option value="titleDesc">Title: Z to A</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;