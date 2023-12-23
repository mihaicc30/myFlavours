"use client";
import React, { useContext, useState } from "react";
import { RecipeCard, getFlavourites } from "../CompsServer";
import { AppContext } from "../AppContextWrapper";
import { usePathname } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import CustomLoading from "../CustomLoading";
import { useSuspenseQuery } from "@tanstack/react-query";

const Favorites = () => {
  const { user } = useContext(AppContext);
  const [search, setSearch] = useState("");

  const clearSearch = () => {
    setSearch("");
  };

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, search],
    queryFn: () => {
      const recipes = getFlavourites(user, search);
      return recipes;
    },
  });

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
        {isPending ? (
          <CustomLoading />
        ) : (
          recipes &&
          recipes.length > 0 &&
          recipes.map((recipeData, index) => {
            return (
              <RecipeCard
                key={index}
                recipe={recipeData}
                measure="grams"
              />
            );
          })
        )}
        {recipes && recipes.length < 1 && <p className="text-center text-xl font-[600] col-span-full">You nave no flavorites!</p>}
        {error && <p>An error has occurred: {error.message}</p>}
      </div>
    </>
  );
};

export default Favorites;
