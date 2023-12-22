"use client";
import React, { useContext, useEffect, useState } from "react";
import BackButton from "./BackButton";
import { FeaturedRecipeCard, getRecipesQuery } from "@/app/CompsServer";
import { AppContext } from "@/app/AppContextWrapper";

export default function RecipeById(params) {
  const { user } = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [recipe, setRecipe] = useState([]);

  useEffect(() => {
    console.log("loading");
    const fetchData = async () => {
      try {
        const recipes = await getRecipesQuery(params?.items, params?.id, params?.author, params?.filterWord);
        setRecipe(recipes);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchData();
  }, [params?.id]);

  return (
    <>
      {loaded && (
        <>
          <BackButton />
          <FeaturedRecipeCard measure={"grams"} showInstructions={true} showIngredients={true} recipe={recipe[0]} />
        </>
      )}
    </>
  );
}