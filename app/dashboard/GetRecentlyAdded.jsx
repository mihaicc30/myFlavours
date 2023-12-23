import React, { Suspense, useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import CustomLoading from "@/app/CustomLoading";
import { AppContext } from "../AppContextWrapper";
import { RecipeCard, getRecipesQuery } from "../CompsServer";

export default function GetRecentlyAdded() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, "GetRecentlyAdded", 10, null,null,null],
    queryFn: () => {
      const recipes = getRecipesQuery(10, null,null,null);
      return recipes;
    },
  });

  return (
    <>
      <Suspense fallback={<CustomLoading />}>
        {recipes.map((recipeData) => (
          <RecipeCard
            key={crypto.randomUUID()}
            measure={"grams"}
            recipe={recipeData}
          />
        ))}
      </Suspense>
    </>
  );
}

{
  /* <RecipeList action={"GetGetRecentlyAdded"} author={user} items={3} showInstructions={false} showIngredients={false} /> */
}
