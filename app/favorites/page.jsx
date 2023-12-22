"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { RecipeCard, getFlavourites } from "../CompsServer";
import { AppContext } from "../AppContextWrapper";
import { usePathname } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { TiDelete } from "react-icons/ti";

const Favorites = () => {
  const { user } = useContext(AppContext);
  const pathname = usePathname();
  const [faved, setFaved] = useState([]);
  const [search, setSearch] = useState("");

  const getFaved = useCallback(async () => {
    if (!user) return;
    let query = await getFlavourites(user);
    setFaved(query);
  }, [user]);

  useEffect(() => {
    getFaved();
  }, [getFaved]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <div className={`grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2 px-2 pt-2 pb-6 overflow-x-hidden`}>
        <div className="flex flex-nowrap col-span-full relative">
          <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-[10px]" />
          <input
            className={`py-2 px-8 w-[100%] mx-auto my-2 bg-white morphx col-span-full`}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <TiDelete
            onClick={clearSearch}
            className="absolute top-1/2 -translate-y-1/2 right-[10px] p-2 text-4xl cursor-pointer active:scale-[.9] transition"
          />
        </div>
        {faved.length > 0 &&
          faved.map((recipeData, index) => {
            if (recipeData.dishName.toLowerCase().includes(search.toLowerCase()) || search === "")
              return (
                <RecipeCard
                  key={index}
                  recipe={recipeData}
                  measure={"grams"}
                />
              );
          })}
      </div>
    </>
  );
};

export default Favorites;
