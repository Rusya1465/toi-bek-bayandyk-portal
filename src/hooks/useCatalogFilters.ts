
import { useState } from "react";

export const useCatalogFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState("default");

  const filterItems = <T extends { name: string; description?: string; price?: string }>(
    items: T[]
  ) => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (priceSort === "asc") {
          return parseInt(a.price || '0') - parseInt(b.price || '0');
        } else if (priceSort === "desc") {
          return parseInt(b.price || '0') - parseInt(a.price || '0');
        }
        return 0;
      });
  };

  return {
    searchQuery,
    setSearchQuery,
    priceSort,
    setPriceSort,
    filterItems,
  };
};
