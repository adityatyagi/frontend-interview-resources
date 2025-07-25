import type { SuggestionItem } from "./types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  suggestions: SuggestionItem[];
}

export function ProductGrid({ suggestions }: ProductGridProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4">
      {suggestions.map((item) => (
        <ProductCard key={item.id} cardDetails={item} />
      ))}
    </div>
  );
}
