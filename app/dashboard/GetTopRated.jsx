import React, { Suspense, useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import CustomLoading from "@/app/CustomLoading";
import { AppContext } from "../AppContextWrapper";
import { RecipeCard, getTopRatedRecipes } from "../CompsServer";

export default function GetTopRated() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, "GetTopRated", 5],
    queryFn: () => {
      const recipes = getTopRatedRecipes(5);
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
  /* <RecipeList action={"GetGetTopRated"} author={user} items={3} showInstructions={false} showIngredients={false} /> */
}
