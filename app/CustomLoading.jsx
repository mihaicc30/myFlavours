export default function CustomLoading(params) {
  return (
    <div className={`${params.classy ? params.classy : ''} flex flex-col justify-center items-center col-span-full`}>
      <span className="animate animate-spin">🥘</span>
      <p className="text-[8px]">Loading..</p>
    </div>
  );
}
