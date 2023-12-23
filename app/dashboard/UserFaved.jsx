import React, { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppContext } from "../AppContextWrapper";
import { getUserFaved } from "../CompsServer";
import Link from "next/link";

export default function UserFaved() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: favedRecipesNumber,
  } = useSuspenseQuery({
    queryKey: ["recipes", user, "favedRecipesNumber", "all"],
    queryFn: () => {
      const favedRecipesNumber = getUserFaved(user);
      return favedRecipesNumber;
    },
  });

  return (
    <>
      {!isPending && !error && (
        <>
          <Link
            href={"/favorites"}
            className={`morphx p-1 border-2 rounded-xl hover:scale-[0.98] transition`}
          >
            {favedRecipesNumber} {favedRecipesNumber < 1 ? "Flavorites" : favedRecipesNumber > 1 ? "Flavorites" : "Flavorite"}
          </Link>
        </>
      )}
    </>
  );
}
