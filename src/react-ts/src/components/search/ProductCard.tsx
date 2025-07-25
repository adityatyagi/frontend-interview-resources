import type { SuggestionItem } from "./types";

interface ProductCardProps {
  cardDetails: SuggestionItem;
}

export function ProductCard({ cardDetails }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <img
            src={cardDetails.image}
            alt={`${cardDetails.name} character`}
            className="w-24 h-24 object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {cardDetails.name}
          </h3>
          <dl className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt className="font-medium">Gender:</dt>
              <dd>{cardDetails.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Species:</dt>
              <dd>{cardDetails.species}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Status:</dt>
              <dd
                className={`capitalize ${
                  cardDetails.status === "Alive"
                    ? "text-green-600"
                    : cardDetails.status === "Dead"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {cardDetails.status}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Origin:</dt>
              <dd>{cardDetails.origin.name}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
