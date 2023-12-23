import React, { Suspense, useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiUserShared2Fill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";
import CustomLoading from "./CustomLoading";
import { getCountRecipe, getCountUser } from "./CompsServer";
import { signInWithGoogle } from "./firebaseConfig";
import { AppContext } from "./AppContextWrapper";
import { useRouter, usePathname } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Auth() {
  const { user, updateContext } = useContext(AppContext);
  const { push } = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (user && path.startsWith("/")) push("/dashboard");
  }, [user, push, path]);

  return (
    <div className={`flex flex-col gap-4 h-[100svh] w-[100svw]`}>
      <div className="flex flex-col my-auto gap-4">
        <div className="relative w-[20svw] h-[25svh] mx-auto min-w-[200px] min-h-[150px]">
          <Image
            priority={true}
            src="/intro.png"
            alt=""
            fill={true}
            sizes="w-[20svw] h-[25svh]"
          />
        </div>
        <p className={`text-center text-xl text-green-600`}>
          Welcome to
          <span className="bg-green-600 text-white p-1 rounded-lg">myFlavour</span>
          by Fimiar
        </p>
        <p className={`text-center max-w-[80svw] mx-auto`}>Find out what&apos;s ideal for you from thousands of recipes in the world.</p>
        {!user ? (
          <>
            <Suspense fallback={<CustomLoading />}>
              <GoogleSignIn />
              <UNPSignIn />
            </Suspense>
            <Suspense fallback={<CustomLoading />}>
              <AuthComps />
            </Suspense>
          </>
        ) : (
          <CustomLoading />
        )}
      </div>
      <span className={`border-b-4 border-gray-500 w-[50svw] mx-auto mt-auto mb-4 rounded-full `}></span>
    </div>
  );
}

const GoogleSignIn = async () => {
  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <button
      className={`text-green-600 flex flex-nowrap gap-2 justify-center items-center border-2 rounded-xl mx-auto p-4`}
      onClick={handleSignIn}
    >
      <FcGoogle className="text-3xl my-auto" />
      Sign In with Google
    </button>
  );
};

const UNPSignIn = async () => {
  const { user, updateContext } = useContext(AppContext);
  const handleSignIn = async () => {
    updateContext({
      user: {
        uid: "dasiuh1iuiudqwiuiuwqdjiu",
        email: "test@user.test",
        displayName: "TestUser",
      },
    });
  };

  return (
    <button
      className={`text-green-600 flex flex-nowrap gap-2 justify-center items-center border-2 rounded-xl mx-auto p-4`}
      onClick={handleSignIn}
    >
      <RiUserShared2Fill className="text-3xl my-auto" />
      Sign in as TestUser
    </button>
  );
};
const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="animate animate-spin">🥘</span>
      <p className="text-[8px]">Loading..</p>
    </div>
  );
};

function AuthComps() {
  const { user } = useContext(AppContext);

  const {
    isPending,
    error,
    data: ownRecipes,
  } = useSuspenseQuery({
    queryKey: ["recipes", user],
    queryFn: () => {
      const recipes = getCountRecipe(user);
      return recipes;
    },
  });

  const { data: userCount } = useSuspenseQuery({
    queryKey: ["users", "getTotalUsers", user],
    queryFn: () => {
      const recipes = getCountUser();
      return recipes;
    },
  });

  return (
    <div className={`flex flex-col justify-center gap-2 relative my-2 max-w-[100svw]`}>
      <p className="text-center text-xl font-[600]">Join our community!</p>
      <div className="flex gap-2 justify-center">
        <Suspense fallback={<Loading />}>
          <div className={`morphx p-1 border-2 rounded-xl`}>
            {ownRecipes} {ownRecipes < 1 ? "Recipes" : ownRecipes > 1 ? "Recipes" : "Recipe"}
          </div>
        </Suspense>
        <Suspense fallback={<Loading />}>
          <span className={`morphx p-1 border-2 rounded-xl`}>
            {userCount} {userCount < 1 ? "Users" : userCount > 1 ? "Users" : "User"}
          </span>
        </Suspense>
      </div>
    </div>
  );
}
