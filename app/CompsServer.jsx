import { db } from "./firebaseConfig";
import { collection, addDoc, getDoc, updateDoc, where, orderBy, limit, getDocs, doc, query, useCollectionData } from "firebase/firestore";
import Link from "next/link";
import { Fragment } from "react";
import Image from "next/image";

export async function addToRecentViewed(itemID, author) {
  if (!author || !itemID) return;
  const q = await query(collection(db, "recipes"), where("id", "==", parseInt(itemID)));
  const result = await getDocs(q);
  const itemData = result.docs.map((element) => element.data())[0];

  const userDocRef = query(collection(db, "users"), where("uid", "==", author.uid));
  const userDoc = await getDocs(userDocRef);
  const userData = userDoc.docs.map((element) => element.data())[0];

  let recentlyViewed = userData.recentlyViewed || [];
  const itemIndex = recentlyViewed.findIndex((item) => item.id === itemData.id);
  if (itemIndex < 0) {
    if (recentlyViewed.length >= 3) {
      recentlyViewed.shift();
    }
    recentlyViewed.push(itemData);
    await updateDoc(userDoc.docs[0].ref, { recentlyViewed });
  }
}

async function getUserFaved(author) {
  if (!author) return 0;
  const q = await query(collection(db, "users"), where("author.uid", "==", author.uid), orderBy("date", "desc"));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data());
  return result.size;
}

export async function UserFaved(params) {
  // await new Promise(resolve=>setTimeout(resolve, 4000))
  const favedRecipes = await getUserFaved(params.author);
  return (
    <Link href={"/favorites"} className={`morphx p-1 border-2 rounded-xl`}>
      {favedRecipes} {favedRecipes < 1 ? "Flavorites" : favedRecipes > 1 ? "Flavorites" : "Flavorite"}
    </Link>
  );
}

async function getTopRatedRecipes(numberOfItems) {
  // console.log(`GRAB ${numberOfItems} ITEMS `);
  const q = await query(collection(db, "recipes"), orderBy("date", "desc"), limit(numberOfItems));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data());
  //   console.log(data)
  return data;
}

async function getCountUser(author) {
  if (author) {
    const q = await query(collection(db, "users"), where("author.uid", "==", author.uid), orderBy("date", "desc"));
    const result = await getDocs(q);
    // const data = result.docs.map((element) => element.data());
    return result.size;
  } else {
    const q = await query(collection(db, "users"), orderBy("date", "desc"));
    const result = await getDocs(q);
    return result.size;
  }
}

export async function GetCountUsers(params) {
  const countUsers = await getCountUser(params.author);
  return (
    <span className={`morphx p-1 border-2 rounded-xl`}>
      {countUsers} {countUsers < 1 ? "Users" : countUsers > 1 ? "Users" : "User"}
    </span>
  );
}

async function getCountRecipe(author) {
  if (author) {
    const q = await query(collection(db, "recipes"), where("author.uid", "==", author.uid), orderBy("date", "desc"));
    const result = await getDocs(q);
    // const data = result.docs.map((element) => element.data());
    return result.size;
  } else {
    const q = await query(collection(db, "recipes"), orderBy("date", "desc"));
    const result = await getDocs(q);
    return result.size;
  }
}

export async function GetCountRecipes(params) {
  // await new Promise(resolve=>setTimeout(resolve, 2500))
  const ownRecipes = await getCountRecipe(params.author);
  return (
    <span className={`morphx p-1 border-2 rounded-xl`}>
      {ownRecipes} {ownRecipes < 1 ? "Recipes" : ownRecipes > 1 ? "Recipes" : "Recipe"} Submitted
    </span>
  );
}

export async function getRecipesByIdQuery(itemID) {
  const q = await query(collection(db, "recipes"), where("id", "==", parseInt(itemID)));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data());
  return data;
}

export async function getAllRecipes() {
  const q = await query(collection(db, "recipes"));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data());
  return data;
}
export async function getAllRecipesIds() {
  const q = await query(collection(db, "recipes"));
  const result = await getDocs(q);
  const data = result.docs.map((element) => ({ id: String(element.data().id) }));
  return data;
}

export async function getRecipesQuery(numberOfItems, idOfSpecificItem, author, filterWord) {
  if (idOfSpecificItem) {
    console.log(`GRAB SPECIFIC ITEM with id ${idOfSpecificItem}.`);
    const q = query(collection(db, "recipes"), where("id", "==", parseInt(idOfSpecificItem)));
    const result = await getDocs(q);
    const data = result.docs.map((element) => element.data());
    //   console.log(data)
    return data;
  } else {
    if (author) {
      console.log("GRAB LIST OF ITEMS BELONGING TO", author);
      const q = await query(collection(db, "recipes"), where("author.uid", "==", author.uid), orderBy("date", "desc"), limit(numberOfItems));
      const result = await getDocs(q);
      const data = result.docs.map((element) => element.data());
      //   console.log(data)
      return data;
    } else {
      // console.log(`GRAB ${numberOfItems} ITEMS `);
      const q = await query(collection(db, "recipes"), orderBy("date", "desc"), limit(numberOfItems));
      const result = await getDocs(q);
      let data = result.docs.map((element) => element.data());
      if (filterWord && filterWord !== "") {
        data = data.filter((item) => item.dishName.toLowerCase().includes(filterWord.toLowerCase()));
      }
      return data;
    }
  }
}

async function getRecentlyViewed(author) {
  if (!author) return [];
  const q = await query(collection(db, "users"), where("uid", "==", author.uid));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data())[0];
  return data.recentlyViewed;
}

async function getFlavourites(author) {
  if (!author) return [];
  const q = await query(collection(db, "users"), where("uid", "==", author.uid));
  const result = await getDocs(q);
  const data = result.docs.map((element) => element.data())[0];
  console.log(Object.values(data.faved));
  return Object.values(data.faved);
}

function RecipeCard({ recipe, params, measure }) {
  // console.log(params)
  return (
    <Link href={`/recipe/${recipe?.id}`} key={crypto.randomUUID()} className={`morphx grid grid-cols-1 grid-rows-[10px_30px_200px_80px] border-2 px-1 py-2 rounded-xl min-w-[280px] m-1 max-sm:min-w-[220px]`}>
      <p className="text-[9px] text-end">{new Date(recipe?.date).toLocaleString()}</p>
      <h1 className="capitalize max-sm:text-sm p-2">{recipe.dishName}</h1>
      {/* {recipe.imgs[0] && <img src="./img1.jpg" alt="someimg" />} */}
      <img className="m-auto rounded-lg aspect-1/1 max-h-[190px]" src={`https://generatorfun.com/code/uploads/Random-Food-image-${Math.floor(Math.random() * 15) + 1}.jpg`} alt="someimg" />
      <div className="grid grid-cols-[1fr_2px_1fr] grid-rows-[26px_2px_26px] gap-2 min-w-[264px] max-sm:min-w-[180px] mt-auto">
        <div className="flex flex-nowrap relative w-[100%]">
          <div className={`grid grid-cols-5 w-[100%] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
            <span role="img" aria-label="rating" className={`${recipe.ratings.avgScore >= 1 ? "" : "opacity-10"}`}>
              ⭐
            </span>
            <span role="img" aria-label="rating" className={`${recipe.ratings.avgScore >= 2 ? "" : "opacity-10"}`}>
              ⭐
            </span>
            <span role="img" aria-label="rating" className={`${recipe.ratings.avgScore >= 3 ? "" : "opacity-10"}`}>
              ⭐
            </span>
            <span role="img" aria-label="rating" className={`${recipe.ratings.avgScore >= 4 ? "" : "opacity-10"}`}>
              ⭐
            </span>
            <span role="img" aria-label="rating" className={`${recipe.ratings.avgScore >= 5 ? "" : "opacity-10"}`}>
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
      </div>
      {params?.showIngredients && (
        <div className={`flex flex-col text-sm py-2 my-2`}>
          <p className="my-2 px-2">Ingredients</p>
          {recipe.ingredients.map((ingredient, index) => {
            const [ingredientName, ingredientDetails] = Object.entries(ingredient)[0];
            for (const [unit, amount] of Object.entries(ingredientDetails)) {
              if (unit === measure)
                return (
                  <span className="px-2" key={crypto.randomUUID()}>
                    {amount} {unit} x <span className="capitalize">{ingredientName}</span>
                  </span>
                );
            }
          })}
        </div>
      )}
      {params?.showInstructions && (
        <div className={`flex flex-col text-sm py-2 my-2`}>
          <p className="px-2 my-2">Steps</p>
          {recipe.instructions.map((instr, index) => (
            <p className="px-2" key={crypto.randomUUID()}>
              {index + 1}. {instr}
            </p>
          ))}
        </div>
      )}
    </Link>
  );
}

export function FeaturedRecipeCard({ recipe, params, measure }) {
  console.log(params);
  return (
    <div key={crypto.randomUUID()} className={`grow flex flex-col pt-10 rounded-t-xl min-w-[280px] max-sm:min-w-[220px] bg-cover bg-top`} style={{ backgroundImage: `url(https://generatorfun.com/code/uploads/Random-Food-image-2.jpg)` }}>
      {/* {recipe?.imgs[0] && <img src="./img1.jpg" alt="someimg" />} */}
      {/* <Image
        className="rounded-lg aspect-1/1 max-h-[200px] scale-[1.5]"
        src={`https://generatorfun.com/code/uploads/Random-Food-image-1.jpg`}
        alt="someimg"
        loading="lazy"
        fill={true}
      /> */}
      <div className="block flex-[30%] relative min-h-[50svw]"></div>
      <div className={`grid grid-cols-1 border-t-2 py-2 pl-2 pr-4 rounded-t-3xl w-[100svw] max-sm:min-w-[220px] z-10 bg-white`}>
        {/* <p className="text-[9px] text-end">{new Date(recipe?.date).toLocaleString()}</p> */}
        <h1 className="capitalize font-[600] p-2">{recipe?.dishName}</h1>
        <div className="grid grid-cols-[1fr_2px_1fr] gap-2 min-w-[264px] max-sm:min-w-[180px]">
          <div className="flex flex-nowrap relative w-[100%]">
            <div className={`grid grid-cols-5 w-[100%] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
              <span role="img" aria-label="rating" className={`${recipe?.ratings.avgScore >= 1 ? "" : "opacity-10"}`}>
                ⭐
              </span>
              <span role="img" aria-label="rating" className={`${recipe?.ratings.avgScore >= 2 ? "" : "opacity-10"}`}>
                ⭐
              </span>
              <span role="img" aria-label="rating" className={`${recipe?.ratings.avgScore >= 3 ? "" : "opacity-10"}`}>
                ⭐
              </span>
              <span role="img" aria-label="rating" className={`${recipe?.ratings.avgScore >= 4 ? "" : "opacity-10"}`}>
                ⭐
              </span>
              <span role="img" aria-label="rating" className={`${recipe?.ratings.avgScore >= 5 ? "" : "opacity-10"}`}>
                ⭐
              </span>
            </div>
          </div>
          <span className="bg-black/10 rounded-full"></span>
          <div className="flex flex-nowrap relative w-[100%]">
            <div className={`grid grid-cols-10 w-[100%] text-[16px] max-sm:text-[10px] items-center justify-items-center`}>
              <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe?.difficulty >= 1 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe?.difficulty >= 1 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-green-400 rotate-[33deg] ${recipe?.difficulty >= 2 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-yellow-400 rotate-[33deg] ${recipe?.difficulty >= 2 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-yellow-400 rotate-[33deg] ${recipe?.difficulty >= 3 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe?.difficulty >= 3 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe?.difficulty >= 4 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-orange-400 rotate-[33deg] ${recipe?.difficulty >= 4 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-red-400 rotate-[33deg] ${recipe?.difficulty >= 5 ? "" : "opacity-10"}`}></span>
              <span className={`h-[100%] w-[4px] rounded-full bg-red-400 rotate-[33deg] ${recipe?.difficulty >= 5 ? "" : "opacity-10"}`}></span>
            </div>
          </div>
          <span className="bg-black/10 rounded-full h-[2px]"></span>
          <span></span>
          <span className="bg-black/10 rounded-full h-[2px]"></span>
          <p className="p-1 rounded-xl text-sm max-sm:text-[10px] flex flex-col justify-center text-center">
            <span className="text-[12px]">
              {Array.from({ length: recipe?.servings }, (_, index) => (
                <Fragment key={crypto.randomUUID()}>👦</Fragment>
              ))}
            </span>
          </p>
          <span className="bg-black/10 rounded-full"></span>
          <p className="p-1 rounded-xl text-sm max-sm:text-[10px] flex flex-col justify-center text-center">
            <span className="max-sm:text-[14px]">👨‍🍳{recipe?.author.displayName}</span>
          </p>
        </div>
        <div className={` grid grid-cols-[1fr_10fr] text-sm my-2 gap-x-4`}>
          {recipe.ingredients.map((ingredient, index) => {
            const [ingredientName, ingredientDetails] = Object.entries(ingredient)[0];
            for (const [unit, amount] of Object.entries(ingredientDetails)) {
              if (unit === measure)
                return (
                  <Fragment key={crypto.randomUUID()}>
                    <span>
                      {amount}
                      {unit}
                    </span>
                    <span className="capitalize">{ingredientName}</span>
                  </Fragment>
                );
            }
          })}
        </div>
        <div className={`flex flex-col text-sm my-2`}>
          {recipe.instructions.map((instr, index) => (
            <div className="ml-4 pl-6 pr-2 relative border-l-2 border-dashed border-black" key={crypto.randomUUID()}>
              <span className="absolute -left-[11px]">⚪</span>
              <p className="font-[600]">Step {index + 1}</p>
              <p className="mb-2">{instr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function RecipeList(params) {
  const measure = "grams";
  let recipes = [];
  switch (params.action) {
    case "GetTopRated":
      recipes = await getTopRatedRecipes(params.items);
      break;
    case "GetRecentlyAdded":
      recipes = await getRecipesQuery(params.items, params.id, params.author, params.filterWord);
      break;
    case "GetRecentlyViewed":
      recipes = await getRecentlyViewed(params.author);
      break;
    case "GetFlavourites":
      recipes = await getFlavourites(params.author);
      break;
    case "SearchRecipes":
      recipes = await getRecipesQuery(params.items, params.id, params.author, params.filterWord);
      break;
    case "GetFeatured":
      recipes = await getRecipesQuery(params?.items, params?.id, params?.author, params?.filterWord);
      break;

    default:
      break;
  }

  if (params?.addToViewed && params?.id && params?.whoIsViewing) addToRecentViewed(params.id, params.whoIsViewing);
  // const recipes =
  // params.topRated
  //     ? await getTopRatedRecipes(params.items)
  //     : params.recentlyViewed
  //         ? await getRecentlyViewed(params.author)
  //         : params.getFlavourites
  //         ? await getFlavourites(params.loggedUser)
  //         : await getRecipesQuery(params.items, params.id, params.author, params.filterWord);

  return (
    <>
      {recipes?.length > 0 &&
        params?.action !== "GetFeatured" &&
        recipes?.map((recipeData, index) => (
          <Fragment key={crypto.randomUUID()}>
            <RecipeCard measure={measure} params={params} recipe={recipeData} />
          </Fragment>
        ))}
      {/* {recipes?.length > 0 && params?.action === "GetFeatured" && (
        <Fragment key={crypto.randomUUID()}>
          {console.log("RE RENDERING?!")}
          <FeaturedRecipeCard measure={measure} params={params} recipe={recipes[0]} />
        </Fragment>
      )} */}

      {recipes?.length < 1 && params?.action === "GetFlavourites" && <p className="text-center">You have not added any recipes!</p>}
      {recipes?.length < 1 && params?.action === "GetRecentlyViewed" && <p className="text-center">You have not looked at any recipes!</p>}
    </>
  );
}
