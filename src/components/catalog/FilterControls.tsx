
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/contexts/LanguageContext";

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
  const { t } = useTranslation();
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("catalog.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={priceSort} onValueChange={onPriceSortChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("catalog.sortByPrice")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t("catalog.sortByPrice")}</SelectItem>
            <SelectItem value="asc">{t("catalog.priceLowToHigh")}</SelectItem>
            <SelectItem value="desc">{t("catalog.priceHighToLow")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
