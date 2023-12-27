"use client";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDoc, getDocs, doc, query, useCollectionData } from "firebase/firestore";
import { useContext } from "react";
import { AppContext } from "../AppContextWrapper";

export default function AddNewRecipeButton() {
  const { user } = useContext(AppContext);

  return (
    <Link
      className={`morphx p-1 border-none rounded-xl ml-auto bg-orange-400 text-white flex justify-center items-center font-[600] tracking-wide hover:scale-[0.98] transition whitespace-nowrap`}
      href={`/profile/${user?.uid}/recipes`}
    >
      Manage Recipes
    </Link>
  );
}
