import { IoMdSearch } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function SearchButton({ searchQuery, setSearchQuery }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("query");
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(search);
  }, [search, setSearchQuery]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const clearSearch = () => {
    router.push(`/search`);
    setSearchQuery("");
  };

  const inputSearch = (val) => {
    setSearchQuery(val);
    // createQueryString("query", val);

    router.push(`/search?${createQueryString("query", val)}`);
  };

  return (
    <div className="flex flex-nowrap col-span-full relative">
      <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-[10px]" />
      <input
        className={`py-2 px-8 w-[100%] mx-auto my-2 bg-white morphx col-span-full`}
        type="text"
        value={!search ? searchQuery : search}
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
