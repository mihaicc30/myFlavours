"use client";
import { AppContext } from "@/app/AppContextWrapper";
import { RecipeCard, getUserRecipez } from "@/app/CompsServer";
import CustomLoading from "@/app/CustomLoading";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { Fragment, Suspense, useContext, useState } from "react";
import { MdLogout } from "react-icons/md";
import { TbChefHat } from "react-icons/tb";
import AddNewRecipe from "./AddNewRecipe";
import UpdateUserRecipe from "./UpdateUserRecipe";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { SiCodechef } from "react-icons/si";

export default function UserRecipess(params) {
  const { user } = useContext(AppContext);
  const [addNewRecipeModal, setAddNewRecipeModal] = useState(false);
  const [updateNewRecipeModal, setUpdateNewRecipeModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const {
    isPending,
    error,
    data: ownRecipes,
  } = useSuspenseQuery({
    queryKey: ["userRecipesManagement", deleteMode, params?.userUID, updateNewRecipeModal, addNewRecipeModal],
    queryFn: () => {
      const recipes = getUserRecipez(params?.userUID);
      return recipes;
    },
  });
  if (isPending) return <CustomLoading />;
  if (error) return <p className="text-center">{error.message}</p>;
  if (!user) return;

  const handleDelete = async () => {
    const q = await query(collection(db, "recipes"), where("id", "==", deleteMode));
    const docx = await getDocs(q);
    const docRef = doc(db, "recipes", docx.docs[0].id);
    await deleteDoc(docRef);
    setDeleteMode(false);
  };

  return (
    <Suspense fallback={<CustomLoading />}>
      {addNewRecipeModal && (
        <AddNewRecipe
          addNewRecipeModal={addNewRecipeModal}
          setAddNewRecipeModal={setAddNewRecipeModal}
        />
      )}
      {updateNewRecipeModal && (
        <UpdateUserRecipe
          updateNewRecipeModal={updateNewRecipeModal}
          setUpdateNewRecipeModal={setUpdateNewRecipeModal}
        />
      )}
      <div className={`${addNewRecipeModal ? "hidden" : "grid"} grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2 px-2 pt-2 pb-6 overflow-x-hidden transition`}>
        <div className="grid grid-cols-1 justify-items-center px-[10vw] gap-4 mt-[5svh] col-span-full ">
          {user && (
            <button
              onClick={() => setAddNewRecipeModal(true)}
              className="border-2 max-w-[140px] border-blue-400 hover:text-white active:text-white hover:bg-blue-400  active:bg-blue-400 rounded-xl w-[100%] h-[14svh] items-center flex flex-col justify-center relative cursor-pointer text-3xl hover:text-4xl transition"
            >
              <TbChefHat className="transition-all " />
              <p className="text-xs font-[600] text-center">+ Recipe</p>
            </button>
          )}
        </div>
        {ownRecipes &&
          ownRecipes.map((recipe) => {
            const formattedDate = new Date(recipe?.date).toLocaleString("en-GB", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            });
            return (
              <div
                key={crypto.randomUUID()}
                className={`morphx grid grid-cols-1 grid-rows-[10px_30px_200px_80px_80px] border-2 px-1 py-2 rounded-xl min-w-[280px] m-1 max-sm:min-w-[220px] `}
              >
                <p className="text-[9px] text-end">{formattedDate}</p>
                <h1 className="capitalize max-sm:text-sm p-2">{recipe.dishName}</h1>
                {/* {recipe.imgs[0] && <img src="./img1.jpg" alt="someimg" />} */}
                <div
                  onClick={() => setUpdateNewRecipeModal(recipe)}
                  className="flex justify-center items-center relative grow h-[200px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {recipe.imgs.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div
                    className={`absolute inset-0 bg-cover rounded-xl m-2 bg-no-repeat bg-center`}
                    style={{ backgroundImage: `url(${recipe.imgs[0]})` }}
                  ></div>
                  ) : (
                    <SiCodechef className="m-auto h-[100px] w-[100px] rounded-full my-4" />
                  )}
                </div>
                <div className="grid grid-cols-[1fr_2px_1fr] grid-rows-[30px_2px_30px_2px_30px] gap-2 min-w-[264px] max-sm:min-w-[180px] mt-auto">
                  <div className="flex flex-nowrap relative w-[100%]">
                    <div className={`grid grid-cols-5 w-[100%] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
                      <span
                        role="img"
                        aria-label="rating"
                        className={`${recipe.ratings.avgScore >= 1 ? "" : "opacity-10"}`}
                      >
                        ⭐
                      </span>
                      <span
                        role="img"
                        aria-label="rating"
                        className={`${recipe.ratings.avgScore >= 2 ? "" : "opacity-10"}`}
                      >
                        ⭐
                      </span>
                      <span
                        role="img"
                        aria-label="rating"
                        className={`${recipe.ratings.avgScore >= 3 ? "" : "opacity-10"}`}
                      >
                        ⭐
                      </span>
                      <span
                        role="img"
                        aria-label="rating"
                        className={`${recipe.ratings.avgScore >= 4 ? "" : "opacity-10"}`}
                      >
                        ⭐
                      </span>
                      <span
                        role="img"
                        aria-label="rating"
                        className={`${recipe.ratings.avgScore >= 5 ? "" : "opacity-10"}`}
                      >
                        ⭐
                      </span>
                    </div>
                  </div>
                  <span className="bg-black/10 rounded-full"></span>
                  <div className="flex flex-nowrap relative w-[100%]">
                    <div className={`grid grid-cols-10 w-[100%] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
                      <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe.difficulty >= 1 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe.difficulty >= 1 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe.difficulty >= 2 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-yellow-400 rotate-[33deg] ${recipe.difficulty >= 2 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-yellow-400 rotate-[33deg] ${recipe.difficulty >= 3 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe.difficulty >= 3 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe.difficulty >= 4 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe.difficulty >= 4 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-red-400 rotate-[33deg] ${recipe.difficulty >= 5 ? "" : "opacity-10"}`}></span>
                      <span className={`h-[100%] w-[4px] rounded-full bg-red-400 rotate-[33deg] ${recipe.difficulty >= 5 ? "" : "opacity-10"}`}></span>
                    </div>
                  </div>
                  <span className="bg-black/10 rounded-full h-[2px]"></span>
                  <span className="h-0 w-0"></span>
                  <span className="bg-black/10 rounded-full h-[2px]"></span>
                  <p className="p-1 rounded-xl text-sm max-sm:text-[10px] flex flex-col justify-center text-center">
                    <span className="text-[12px]">
                      {Array.from({ length: recipe.servings }, (_, index) => (
                        <Fragment key={crypto.randomUUID()}>👦</Fragment>
                      ))}
                    </span>
                  </p>
                  <span className="bg-black/10 rounded-full"></span>
                  <p className="p-1 rounded-xl text-sm max-sm:text-[10px] flex flex-col justify-center text-center">
                    <span className="max-sm:text-[14px]">👨‍🍳{recipe.author.displayName}</span>
                  </p>
                  <>
                    <span className="bg-black/10 rounded-full h-[2px]"></span>
                    <span className="h-0 w-0"></span>
                    <span className="bg-black/10 rounded-full h-[2px]"></span>
                    <div className="flex justify-evenly gap-2">
                      {deleteMode === recipe.id ? (
                        <>
                          <button
                            onClick={handleDelete}
                            className="text-red-400 hover:text-white active:text-white border-2 border-red-400/50 hover:bg-red-400  active:bg-red-400 transition rounded-xl flex-1"
                          >
                            Confirm
                          </button>
                          <button
                            className="text-orange-400 border-2 border-orange-400/50 hover:text-white active:text-white hover:bg-orange-400  active:bg-orange-400 transition rounded-xl flex-1"
                            onClick={() => setDeleteMode(false)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-red-400 border-2 border-red-400/50 hover:text-white active:text-white hover:bg-red-400  active:bg-red-400 transition rounded-xl flex-1"
                          onClick={() => setDeleteMode(recipe.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <span className="bg-black/10 rounded-full"></span>
                    <button
                      onClick={() => setUpdateNewRecipeModal(recipe)}
                      className="text-orange-400 border-2 border-orange-400/50 hover:text-white active:text-white hover:bg-orange-400  active:bg-orange-400 transition rounded-xl"
                    >
                      Update
                    </button>
                  </>
                </div>
              </div>
            );
          })}
        {ownRecipes && ownRecipes.length < 1 && <p className="text-center col-span-full">No recipes.</p>}
        {error && <p>An error has occurred: {error.message}</p>}
      </div>
    </Suspense>
  );
}
