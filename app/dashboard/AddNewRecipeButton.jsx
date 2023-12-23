"use client";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDoc, getDocs, doc, query, useCollectionData } from "firebase/firestore";

async function addRecipeQuery() {
  let recipeObject = {
    id: new Date().getTime(),
    faved: 0,
    author: {
      displayName: "Mihai",
      id: 1701774591679,
      avatar: "",
    },
    difficulty: "medium",
    ingredients: [
      {
        pheasant: {
          grams: 1000,
        },
      },
      {
        fries: {
          grams: 500,
        },
      },
    ],
    imgs: [],
    instructions: ["cook pheasant", "eat pheasant"],
    dishName: "pheasant dish",
    ratings: {
      avgScore: 0,
      usersRated: {},
    },
    servings: 2,
    date: new Date().toISOString(),
  };
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const docRef = await addDoc(collection(db, "recipes"), recipeObject);
    console.log(docRef.id);
    return ["1", "2"];
  } catch (error) {
    console.log(error);
    return ["1", "2"];
  }
}
//   const ref = collection(firestore, "rooms");
//   const q = query(ref, orderBy(sortingType, sortingOrder));
//   const [roomRawData] = useCollectionData(q);

export default function AddNewRecipeButton() {
  // await new Promise(resolve=>setTimeout(resolve, 2000))
  const handleButton = async () => {
    console.log(await addRecipeQuery());
  };

  return (
    <button
      className={`morphx p-1 border-none rounded-xl ml-auto bg-orange-400 text-white font-[600] tracking-wide hover:scale-[0.98] transition`}
      onClick={() => handleButton()}
    >
      Manage Recipes
    </button>
  );
}
