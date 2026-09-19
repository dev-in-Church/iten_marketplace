export function ProductBadges({
  discount,
  featured,
}: {
  discount: number | null;
  featured: boolean;
}) {
  return (
    <>
      {discount !== null && (
        <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </span>
      )}
      {featured && (
        <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
          FEATURED
        </span>
      )}
    </>
  );
}
