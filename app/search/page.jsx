"use client";
import { Suspense, useState } from "react";
import { RecipeList } from "../CompsServer";
import SearchButton from "./SearchButton";
import CustomLoading from "../CustomLoading";
// import {SearchButton} from "./SearchButton"

// https://github.com/HamedBahram/next-pagination/blob/main/app/movies/page.tsx

const Search = () => {
  const [nameQuery, setNameQuery] = useState("");
  return (
    <div className={`grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2 px-2 pt-2 pb-6 overflow-x-hidden`}>
      <SearchButton
        searchQuery={nameQuery}
        setSearchQuery={setNameQuery}
      />
      <Suspense fallback={<CustomLoading />}>
        <RecipeList
          action={"SearchRecipes"}
          filterWord={nameQuery}
          items={10}
          showInstructions={false}
          showIngredients={false}
        />
      </Suspense>
    </div>
  );
};

export default Search;
