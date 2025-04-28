
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priceSort: string;
  onPriceSortChange: (value: string) => void;
}

export const FilterControls = ({
  searchQuery,
  onSearchChange,
  priceSort,
  onPriceSortChange,
}: FilterControlsProps) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Издөө..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="w-full md:w-48">
        <Select value={priceSort} onValueChange={onPriceSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Баасы боюнча" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Баасы боюнча</SelectItem>
            <SelectItem value="asc">Арзандан кымбатка</SelectItem>
            <SelectItem value="desc">Кымбаттан арзанга</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
