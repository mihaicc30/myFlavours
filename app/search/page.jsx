"use client";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RecipeCard, getRecipesQuery } from "../CompsServer";
import SearchButton from "./SearchButton";
import CustomLoading from "../CustomLoading";
import { useSearchParams } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("query");

  const [nameQuery, setNameQuery] = useState(!search ? "" : search);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", 10, nameQuery, !search ? "" : search],
    queryFn: () => {
      const recipes = getRecipesQuery(10, null, null, nameQuery);
      return recipes;
    },
  });

  return (
    <div className={`flex flex-wrap justify-center gap-4 pl-2 pr-8 pt-2 pb-6 overflow-x-hidden`}>
      <SearchButton
        searchQuery={nameQuery}
        setSearchQuery={setNameQuery}
      />
      {isPending ? (
        <CustomLoading />
      ) : (
        <>
          {recipes &&
            recipes.map((recipe) => {
              return (
                <RecipeCard
                  key={crypto.randomUUID()}
                  recipe={recipe}
                  measure="grams"
                />
              );
            })}
          {recipes && recipes.length < 1 && <p className="text-center col-span-full">No recipes with name &rdquo;{nameQuery}&rdquo;.</p>}
          {error && <p>An error has occurred: {error.message}</p>}
        </>
      )}
    </div>
  );
};

export default Search;
