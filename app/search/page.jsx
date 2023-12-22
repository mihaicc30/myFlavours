import { Suspense } from "react";
import {RecipeList} from "../CompsServer"
import { IoMdSearch } from "react-icons/io";
// import {SearchButton} from "./SearchButton"

// https://github.com/HamedBahram/next-pagination/blob/main/app/movies/page.tsx



const Search = async() => {

  return (
    <div className={`grid grid-cols-2 max-sm:grid-cols-1 gap-2 p-2 overflow-x-hidden`}>
      <Suspense fallback={<Loading />}>
        <RecipeList action={"SearchRecipes"} filterWord={""} items={10} showInstructions={false} showIngredients={false} />
      </Suspense>
    </div>
  );
};

export default Search;

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="animate animate-spin">🥘</span>
      <p className="text-[8px]">Loading..</p>
    </div>
  );
};
