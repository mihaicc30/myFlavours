"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import BackButton from "./BackButton";
import { FeaturedRecipeCard, getRecipesQuery, rateThisRecipe } from "@/app/CompsServer";
import { AppContext } from "@/app/AppContextWrapper";
import FavButton from "./FavButton";
import { useSuspenseQuery } from "@tanstack/react-query";
import CustomLoading from "@/app/CustomLoading";

export default function RecipeById(params) {
  const { user } = useContext(AppContext);
  const [showThisImg, setShowThisImg] = useState(false);
  const [showThisImgIndex, setShowThisImgIndex] = useState(0);

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user],
    queryFn: () => {
      const recipes = getRecipesQuery(params?.items, params?.id, user, params?.filterWord);
      return recipes;
    },
  });

  const showImg = (e) => {
    console.log(e.target.className)
    if(String(e.target.className).startsWith("mainImg")) setShowThisImg(!showThisImg);
  };

  return (
    <>
      <BackButton />
      <FavButton />
      {isPending ? (
        <CustomLoading />
      ) : (
        <>
          <Suspense>
            {showThisImg && recipes[0].imgs.length > 0 && (
              <div
                onClick={showImg}
                className="mainImgContainer absolute bg-black/80 z-50 flex justify-center flex-col items-center inset-0 transition opacity-0 animate-fadeIN"
              >
                <div className="flex relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="mainImg animate-fadeUP transition"
                    src={recipes[0].imgs[showThisImgIndex]}
                    alt="Recipe image"
                  />
                </div>
                  <div className="absolute bottom-0 left-0 flex justify-center z-[51] w-[100%]">
                    {recipes[0].imgs.length > 0 && recipes[0].imgs.map((img, i) => (
                      <button
                        key={crypto.randomUUID()}
                        onClick={() => setShowThisImgIndex(i)}
                        className="p-2 text-[5svw]"
                      >
                        ⚪
                      </button>
                    ))}
                  </div>
              </div>
            )}
            <FeaturedRecipeCard
              showImg={showImg}
              measure="grams"
              showInstructions={true}
              showIngredients={true}
              recipe={recipes[0]}
              user={user}
            />
            <RatingComp
              recipe={recipes[0]}
              user={user}
            />
          </Suspense>
        </>
      )}
      {error && <p>An error has occurred: {error.message}</p>}
    </>
  );
}

const RatingComp = ({ recipe, user }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [recipeAvgScore, setRecipeAvgScore] = useState(false);
  const [userRated, setUserRated] = useState(false);

  const handleStarHover = (index) => {
    setHoveredIndex(index);
  };

  const handleStarLeave = () => {
    setHoveredIndex(null);
  };

  const {
    isPending,
    error,
    data: recipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, recipe],
    queryFn: () => {
      const recipes = getRecipesQuery(null, recipe.id, user, null);
      return recipes;
    },
  });

  const calculateRating = (updatedRecipe) => {
    setRecipeAvgScore((Object.values(updatedRecipe.ratings.usersRated).reduce((acc, rating) => acc + rating, 0) / Object.keys(updatedRecipe.ratings.usersRated).length).toFixed(1));
  };

  useEffect(() => {
    recipes[0]["ratings"]["usersRated"][user.uid] ? setUserRated(recipes[0]["ratings"]["usersRated"][user.uid]) : setUserRated(false);
  }, [recipe, recipes, user.uid]);

  useEffect(() => {
    if (userRated) recipes[0]["ratings"]["usersRated"][user.uid] = userRated;
    calculateRating(recipes[0]);
  }, [recipes, hoveredIndex, userRated, user.uid]);

  const rateRecipe = async (rating, recipe, userUID) => {
    await rateThisRecipe(rating, recipe.id, userUID);
  };

  return (
    <div className={`flex flex-col text-sm my-2 mb-[10vh]`}>
      <p className="my-2 px-2 whitespace-nowrap text-xl font-bold">Rate this recipe</p>
      <p className="my-2 px-2 whitespace-nowrap text-lg flex items-baseline">
        {(Object.values(recipes[0].ratings.usersRated).reduce((acc, rating) => acc + rating, 0) / Object.keys(recipes[0].ratings.usersRated).length).toFixed(1) || 0} score from {Object.keys(recipe.ratings.usersRated).length} ratings
      </p>
      <div className={`grid grid-cols-5 w-[100%] max-w-[300px] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
        {[...Array(5)].map((_, index) => (
          <span
            key={crypto.randomUUID()}
            role="img"
            aria-label="rating"
            className={`transition-all duration-300 text-3xl ${index < hoveredIndex ? "grayscale-0" : userRated && userRated >= index + 1 && !hoveredIndex ? "" : "grayscale"}`}
            onMouseOver={() => handleStarHover(index + 1)}
            onMouseLeave={handleStarLeave}
            onTouchStart={() => handleStarHover(index + 1)}
            onClick={() => {
              rateRecipe(index + 1, recipe, user.uid);
              setUserRated(index + 1);
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
};
