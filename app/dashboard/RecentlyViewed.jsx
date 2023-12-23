import React, { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import CustomLoading from "@/app/CustomLoading";
import { AppContext } from "../AppContextWrapper";
import { RecipeCard, getRecentlyViewed } from "../CompsServer";

export default function RecentlyViewed() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, "recentlyViewed"],
    queryFn: () => {
      const recipes = getRecentlyViewed(user);
      return recipes;
    },
  });

  return (
    <>
        {recipes.map((recipeData) => (
          <RecipeCard
            key={crypto.randomUUID()}
            measure={"grams"}
            recipe={recipeData}
          />
        ))}
    </>
  );
}

{
  /* <RecipeList action={"GetRecentlyViewed"} author={user} items={3} showInstructions={false} showIngredients={false} /> */
}
