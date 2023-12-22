"use client";
import { Fragment, Suspense, useContext, useEffect, useState } from "react";
import { RecipeList, GetCountRecipes, GetCountUsers, UserFaved } from "../CompsServer";
import { AddNewRecipeButton } from "../CompsClient";
import { IoMdSearch } from "react-icons/io";
import { AppContext } from "../AppContextWrapper";
import { usePathname, useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, updateContext } = useContext(AppContext);
  const { push } = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!user && path.startsWith("/dashboard")) push("/");
  }, [user, push, path]);

  const measure = "grams";
  const [punNo, setPunNo] = useState(false);
  // console.log("TCL: Dashboard -> punNo", punNo);
  
  useEffect(() => {
    if(!punNo) setPunNo(Math.floor(Math.random() * 20) + 1);
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

  if(!user) return

  return (
    <div className="m-[4px]">
      {punNo && user && <div className={`flex flex-col px-4 mt-8`}>
        <p className="text-xl font-[600]">
          {user?.displayName && <span>Hi, {user?.displayName}!</span>} {punNo && <span>{puns[punNo]}</span>}
        </p>
      </div>}

      <div className={`flex flex-nowrap px-4 relative`}>
        <div className={`flex flex-nowrap relative w-[100%]`}>
          <IoMdSearch className="absolute top-[50%] -translate-y-[50%] left-[10px]" />
          <input className={`py-2 pr-4 pl-8 w-[100%] mx-auto my-2 bg-white morphx`} type="text" defaultValue={""} placeholder="Search..." />
        </div>
      </div>
      <div className={`flex flex-nowrap px-2 gap-2 relative my-8 max-w-[99svw]`}>
        <Suspense fallback={<Loading />}>
          <AddNewRecipeButton />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <GetCountRecipes author={user} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <UserFaved author={user} />
        </Suspense>
      </div>

      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>Recently viewed</span>
        <Suspense fallback={<Loading />}>
          <RecipeList action={"GetRecentlyViewed"} author={user} items={3} showInstructions={false} showIngredients={false} />
        </Suspense>
      </div>

      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>TOP 5 Rated</span>
        <Suspense fallback={<Loading />}>
          <RecipeList action={"GetTopRated"} items={5} showInstructions={false} showIngredients={false} />
        </Suspense>
      </div>
      <div className={`flex flex-nowrap overflow-x-auto px-2 py-5 gap-2 relative my-8 max-w-[99svw]`}>
        <span className={`absolute top-0 left-4 text-sm font-[600]`}>Recently added recipes</span>
        <Suspense fallback={<Loading />}>
          <RecipeList action={"GetRecentlyAdded"} items={5} showInstructions={false} showIngredients={false} />
        </Suspense>
      </div>
    </div>
  );
}

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="animate animate-spin">🥘</span>
      <p className="text-[8px]">Loading..</p>
    </div>
  );
};
