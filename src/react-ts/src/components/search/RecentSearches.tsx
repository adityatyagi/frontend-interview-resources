import type { RecentSearchesProps } from "./types";

export default function RecentSearches({
  recentSearches,
}: RecentSearchesProps) {
  console.log("recentSearches", recentSearches);
  if (recentSearches?.length === 0) return null;

  return (
    <>
      <h3 className="text-black font-bold text-2xl text-left">
        Recent Searches
      </h3>
      <div className="flex flex-wrap">
        {recentSearches.map((item) => (
          <span
            className="p-2 m-2 bg-blue-950 text-white border border-blue-500 rounded-lg"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </>
  );
}
