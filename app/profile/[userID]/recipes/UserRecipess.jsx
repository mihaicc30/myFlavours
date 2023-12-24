"use client";
import { AppContext } from "@/app/AppContextWrapper";
import { RecipeCard, getUserRecipez } from "@/app/CompsServer";
import CustomLoading from "@/app/CustomLoading";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Fragment, Suspense, useContext } from "react";

export default function UserRecipess(params) {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: ownRecipes,
  } = useSuspenseQuery({
    queryKey: ["userRecipesManagement", params?.userUID],
    queryFn: () => {
      const recipes = getUserRecipez(params?.userUID);
      return recipes;
    },
  });
  if (isPending) return <CustomLoading />;
  if (error) return <p className="text-center">{error.message}</p>;
  if (!user) return;

  return (
    <Suspense fallback={<CustomLoading />}>
      <div className={`grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2 px-2 pt-2 pb-6 overflow-x-hidden`}>
        {ownRecipes &&
          ownRecipes.map((recipe) => {
            return (
              <Fragment key={crypto.randomUUID()}>
                <RecipeCard
                  key={crypto.randomUUID()}
                  recipe={recipe}
                  measure="grams"
                  editMode={true}
                />
              </Fragment>
            );
          })}
        {ownRecipes && ownRecipes.length < 1 && <p className="text-center col-span-full">No recipes.</p>}
        {error && <p>An error has occurred: {error.message}</p>}
      </div>
    </Suspense>
  );
}
