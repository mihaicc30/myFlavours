"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import BackButton from "./BackButton";
import { FeaturedRecipeCard, getRecipesQuery } from "@/app/CompsServer";
import { AppContext } from "@/app/AppContextWrapper";
import FavButton from "./FavButton";
import { useSuspenseQuery } from "@tanstack/react-query";
import CustomLoading from "@/app/CustomLoading";

export default function RecipeById(params) {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey:  ['recipes', params?.author, params?.filterWord, params?.id, params?.items],
    queryFn: () => {
      const recipes = getRecipesQuery(params?.items, params?.id, user, params?.filterWord);
      return recipes;
    },
  });

  return (
    <>
      <BackButton />
      <FavButton />
      {isPending ? (
        <CustomLoading />
      ) : (
        <FeaturedRecipeCard
          measure="grams"
          showInstructions={true}
          showIngredients={true}
          recipe={recipes[0]}
        />
      )}
      {error && <p>An error has occurred: {error.message}</p>}
    </>
  );
}
