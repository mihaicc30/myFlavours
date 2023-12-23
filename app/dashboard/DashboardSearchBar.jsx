import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";

import { IoMdSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import CustomLoading from "../CustomLoading";

export default function DashboardSearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [timerId, setTimerId] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    // Clear the existing timer when the input changes
    if (timerId) {
      setTimerId(false);
      clearTimeout(timerId);
    }
    if (searchValue === "") return;
    // Set a new timer for redirection after 2 seconds
    const newTimerId = setTimeout(() => {
      // Redirect the user to /search?query=<search-value>
      if (searchValue === "") return;
      push(`/search?query=${encodeURIComponent(searchValue)}`);
    }, 2000);

    setTimerId(true);

    // Clean up the timer when the component unmounts
    return () => {
      clearTimeout(newTimerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, timerId]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };
  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="flex flex-nowrap px-4 relative">
      <div className="flex flex-nowrap relative w-[100%]">
        {!timerId && <IoMdSearch className="absolute top-[50%] -translate-y-[50%] left-[10px]" />}
        {timerId && <CustomLoading classy={"absolute top-[50%] -translate-y-[40%] left-[6px]"} />}
        <input
          className="py-2 px-10 w-[100%] mx-auto my-2 bg-white morphx"
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search..."
        />
        <TiDelete
          onClick={clearSearch}
          className="absolute top-1/2 -translate-y-1/2 right-[10px] p-2 text-4xl cursor-pointer active:scale-[.9] transition"
        />
      </div>
    </div>
  );
}
