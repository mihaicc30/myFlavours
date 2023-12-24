"use client";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDoc, getDocs, doc, query, useCollectionData } from "firebase/firestore";
import { useContext } from "react";
import { AppContext } from "../AppContextWrapper";

// async function addRecipeQuery() {
//   let recipeObject = {
//     id: new Date().getTime(),
//     faved: 0,
//     author: {
//       displayName: "Mihai",
//       id: 1701774591679,
//       avatar: "",
//     },
//     difficulty: "medium",
//     ingredients: [
//       {
//         pheasant: {
//           grams: 1000,
//         },
//       },
//       {
//         fries: {
//           grams: 500,
//         },
//       },
//     ],
//     imgs: [],
//     instructions: ["cook pheasant", "eat pheasant"],
//     dishName: "pheasant dish",
//     ratings: {
//       avgScore: 0,
//       usersRated: {},
//     },
//     servings: 2,
//     date: new Date().toISOString(),
//   };
//   //   await new Promise((resolve) => setTimeout(resolve, 2000));
//   try {
//     const docRef = await addDoc(collection(db, "recipes"), recipeObject);
//     console.log(docRef.id);
//     return ["1", "2"];
//   } catch (error) {
//     console.log(error);
//     return ["1", "2"];
//   }
// }

export default function AddNewRecipeButton() {
  const { user } = useContext(AppContext);

  return (
    <Link
      className={`morphx p-1 border-none rounded-xl ml-auto bg-orange-400 text-white flex justify-center items-center font-[600] tracking-wide hover:scale-[0.98] transition`}
      href={`/profile/${user?.uid}/recipes`}
    >
      Manage Recipes
    </Link>
  );
}
