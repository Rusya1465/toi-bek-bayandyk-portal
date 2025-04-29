
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2 md:gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("catalog.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 md:pl-10 text-sm h-9 md:h-10"
        />
      </div>
      
      <div className="w-full sm:w-40 md:w-48">
        <Select value={priceSort} onValueChange={onPriceSortChange}>
          <SelectTrigger className="h-9 md:h-10 text-sm">
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
