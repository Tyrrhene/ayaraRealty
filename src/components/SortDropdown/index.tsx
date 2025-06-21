'use client'

import React from 'react'

type SortDropdownProps = {
  sortBy: string
  setSortBy: (value: string) => void
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, setSortBy }) => {
  return (
    <div className="ml-[40px]">
      <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="default">Select</option>
        <option value="price:asc">Lowest Price</option>
        <option value="price:desc">Highest Price</option>
        <option value="createdAt:desc">Newest Listings</option>
        <option value="createdAt:asc">Oldest Listings</option>
      </select>
    </div>
  )
}
