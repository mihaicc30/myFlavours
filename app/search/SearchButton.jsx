import { IoMdSearch } from "react-icons/io";
import { TiDelete } from "react-icons/ti";

export default function SearchButton({ searchQuery, setSearchQuery }) {


  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const inputSearch = (val) => {
    setSearchQuery(val);
  };
  

  return (
    <div className="flex flex-nowrap col-span-full relative">
      <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-[10px]" />
      <input
        className={`py-2 px-8 w-[100%] mx-auto my-2 bg-white morphx col-span-full`}
        type="text"
        value={searchQuery}
        onChange={(e) => inputSearch(e.target.value)}
        placeholder="Search..."
      />
      <TiDelete
        onClick={clearSearch}
        className="absolute top-1/2 -translate-y-1/2 right-[10px] p-2 text-4xl cursor-pointer active:scale-[.9] transition"
      />
    </div>
  );
}
