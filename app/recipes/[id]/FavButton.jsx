"use client";
import { AppContext } from "@/app/AppContextWrapper";
import { toggleFavThisItem, isFaved } from "@/app/CompsServer";
import CustomLoading from "@/app/CustomLoading";
import { usePathname } from "next/navigation";
import React, { Suspense, useCallback, useContext, useEffect, useState } from "react";
import { FcLike } from "react-icons/fc";

export default function FavButton() {
  const { user } = useContext(AppContext);
  const [faved, setFaved] = useState(false);
  const pathname = usePathname();

  const handleFav = async () => {
    await toggleFavThisItem(pathname.replace("/recipe/", ""), user.uid);
    setFaved(!faved);
  };

  const isItFaved = useCallback(async () => {
    if (!user || !pathname.replace("/recipe/", "")) return;
    let query = await isFaved(pathname.replace("/recipe/", ""), user.uid);
    setFaved(query);
  }, [user, pathname]);

  useEffect(() => {
    isItFaved();
  }, [isItFaved]);

  return (
    <Suspense fallback={<CustomLoading />}>
      <button
        className={`py-4 px-4 z-50 bg-white border-2 rounded-full absolute m-3 right-0 ${faved ? "" : "grayscale"}`}
        onClick={handleFav}
      >
        <FcLike className={`text-3xl `} />
      </button>
    </Suspense>
  );
}
