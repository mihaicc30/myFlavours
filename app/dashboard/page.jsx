"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import AddNewRecipeButton from "./AddNewRecipeButton";
import { AppContext } from "../AppContextWrapper";
import { usePathname, useRouter } from "next/navigation";
import CustomLoading from "@/app/CustomLoading";
import DashboardSearchBar from "./DashboardSearchBar";
import RecentlyViewed from "./RecentlyViewed";
import GetTopRated from "./GetTopRated";
import GetRecentlyAdded from "./GetRecentlyAdded";
import UserFaved from "./UserFaved";
import GetUserCountRecipes from "./GetUserCountRecipes";

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const { push } = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!user && path.startsWith("/dashboard")) push("/");
  }, [user, push, path]);

  const [punNo, setPunNo] = useState(false);

  useEffect(() => {
    if (!punNo) setPunNo(Math.floor(Math.random() * 20) + 1);
  }, [punNo]);

  const puns = [
    "I'm reading a book on the history of soup. It's my stock-in-trade.",
    "As a chef, I'm always on thyme.",
    "I'm married to a baker. He kneads me.",
    "I'm a vegan chef, but I always take a bao to go.",
    "My favorite thing about being a chef is the gratin-faction.",
    "I'm so good at making pastries, it's custard-y to perfection.",
    "I'm sick of peeling vegetables. It's a real turnip for the books.",
    "Cooking with my cast iron skillet is a solid choice.",
    "My favorite show is the Great British Bake-off. It's a real dough-sey-dough.",
    "I wanted to invest in the meat industry, but then I realized I could make more dough as a baker.",
    "As a chef, I'm always egg-cited.",
    "When it comes to kitchen utensils, you have to be a little spatula-tive.",
    "The best thing about being a chef is the instant-grattery.",
    "I'm like a chef in a bank - always counting my plating.",
    "I'm not a chef, but I'll play one on plate.",
    "I have a cooking show that's all about eggs. It's called Omelet You Finish.",
    "I love cooking with mushrooms. They really bring me out of my shell.",
    "When life gives you lemons, make sure you know how to zest them.",
    "Cooking over a campfire can be a s'more-ly good time.",
    "As a chef, I'm not one to mince words.",
  ];

  if (!user) return;

  return (
    <div className="m-[4px]">
      {punNo && user && (
        <div className={`flex flex-col px-4 mt-8`}>
          <p className="text-xl font-[600]">
            {user?.displayName && <span>Hi, {user?.displayName}!</span>} {punNo && <span>{puns[punNo]}</span>}
          </p>
        </div>
      )}
      <Suspense fallback={<CustomLoading />}>
        <DashboardSearchBar />
      </Suspense>
      <div className={`flex flex-nowrap px-2 gap-2 relative my-8 max-w-[99svw]`}>
        <Suspense fallback={<CustomLoading />}>
          <GetUserCountRecipes />
        </Suspense>
        <Suspense fallback={<CustomLoading />}>
          <UserFaved />
        </Suspense>
        <Suspense fallback={<CustomLoading />}>
          <AddNewRecipeButton />
        </Suspense>
      </div>

      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>Recently viewed</span>
        <Suspense fallback={<CustomLoading />}>
          <RecentlyViewed />
        </Suspense>
      </div>

      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>TOP 5 Rated</span>
        <Suspense fallback={<CustomLoading />}>
          <GetTopRated />
        </Suspense>
      </div>
      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>Recently added recipes</span>
        <Suspense fallback={<CustomLoading />}>
          <GetRecentlyAdded />
        </Suspense>
      </div>
    </div>
  );
}
