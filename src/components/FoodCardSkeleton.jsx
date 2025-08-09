export default function FoodCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow animate-pulse border border-base-300">
      <div className="h-40 bg-base-300" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-base-300 rounded" />
        <div className="h-3 w-1/2 bg-base-300 rounded" />
        <div className="h-3 w-2/3 bg-base-300 rounded" />
        <div className="h-9 w-full bg-base-300 rounded" />
      </div>
    </div>
  );
}