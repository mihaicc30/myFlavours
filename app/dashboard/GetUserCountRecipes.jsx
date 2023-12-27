import React, { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppContext } from "../AppContextWrapper";
import { getCountRecipe, getUserFaved } from "../CompsServer";
import Link from "next/link";

export default function GetUserCountRecipes() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: ownRecipesNumber,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, "ownRecipesNumber", "all"],
    queryFn: () => {
      const ownRecipesNumber = getCountRecipe(user);
      return ownRecipesNumber;
    },
  });

  return (
    <>
      {!isPending && !error && (
        <>
          <Link
            // todo get link to user recipes page
            href={`/profile/${user.uid}/recipes`}
            className={`morphx p-1 border-2 rounded-xl hover:scale-[0.98] transition whitespace-nowrap`}
          >
            {ownRecipesNumber} {ownRecipesNumber < 1 ? "Recipes" : ownRecipesNumber > 1 ? "Recipes" : "Recipe"}
          </Link>
        </>
      )}
    </>
  );
}
