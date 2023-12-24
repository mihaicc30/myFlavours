"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, logOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getStoredUser } from "./CompsServer";
export const AppContext = createContext();

export function AppContextWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [contextValues, setContextValues] = useState({
    user: false,
  });

  const updateContext = (newValues) => {
    setContextValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getStoredUser(user.uid);
          updateContext({ user: userData });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Handle the case when the user is not authenticated
        updateContext({ user: null });
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const [redirectTimer, setRedirectTimer] = useState(false);

  useEffect(() => {
    if (!contextValues.user && pathname !== "/") {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
      const timer = setTimeout(() => {
        if (!contextValues.user) router.push("/");
      }, 3000);

      setRedirectTimer(true);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [contextValues.user, pathname, router, redirectTimer]);

  return (
    <AppContext.Provider value={{ ...contextValues, updateContext }}>
      <div className={`flex flex-col w-[100svw] h-[100svh]`}>
        <TopNav />
        <div className={`flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-[#FCFCFA]`}>{children}</div>
        <BotNav />
      </div>
    </AppContext.Provider>
  );
}

import { SiCodechef } from "react-icons/si";
import { TbNavigationPin } from "react-icons/tb";
import { GiArchiveResearch } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import Link from "next/link";

function TopNav() {
  const { user, updateContext } = useContext(AppContext);
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && !pathname.startsWith("/recipe") && (
        <div className={`basis-[60px] bg-gradient-to-b from-[#cacaca] to-transparent flex flex-nowrap justify-between w-[100%] overflow-x-hidden`}>
          {/* <Link href="/" className="p-4 relative cursor-pointer text-3xl hover:text-4xl ">
            <TiThMenu className="transition-all absolute left-0" />
          </Link> */}
          <Link
            href="/dashboard"
            className={`flex flex-col pt-1 cursor-pointer select-none relative ml-2 hover:scale-[0.98] active:scale-[.9] transition`}
          >
            <h1 className="m-0 text-3xl text-center text-white py-1 px-4 rounded-lg logoC">myFlavour</h1>
            <h2 className="text-center bg-white rounded-lg leading-[1px] absolute top-[40px] left-[50%] -translate-x-[25%] whitespace-nowrap p-[7px] border-b-2">by Fimiar</h2>
          </Link>
          <div className="flex mx-4">
            {user && pathname !== `/profile/${user?.uid}` && (
              <Link
                href={`/profile/${user?.uid}`}
                className="relative flex cursor-pointer text-3xl hover:text-4xl "
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="m-auto h-[40px] w-[40px] rounded-full"
                    src={user.avatar}
                    alt="Chef"
                  />
                ) : (
                  <SiCodechef className="transition-all absolute right-0 my-auto text-[50px] border-2 border-white rounded-full p-2" />
                )}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function BotNav() {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" && (
        <div className={`basis-[50px] px-10 bg-gradient-to-t from-[#cacaca] to-transparent flex flex-nowrap justify-evenly w-[100%] border-t-2 overflow-x-hidden`}>
          <Link
            href="/dashboard"
            className={`${pathname === "/dashboard" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex hover:scale-[.98] active:scale-[0.9] transition`}
          >
            <TbNavigationPin className={`${pathname === "/dashboard" ? " " : "grayscale opacity-40"} text-blue-600 transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
          </Link>
          <Link
            href="/favorites"
            className={`${pathname === "/favorites" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex hover:scale-[.98] active:scale-[0.9] transition`}
          >
            <FcLike className={`${pathname === "/favorites" ? "text-red-600 " : "grayscale opacity-40"} transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
          </Link>
          <Link
            href="/search"
            className={`${pathname === "/search" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex hover:scale-[.98] active:scale-[0.9] transition`}
          >
            <GiArchiveResearch className={`${pathname === "/search" ? " " : "grayscale opacity-40"} text-orange-600 transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
          </Link>
        </div>
      )}
    </>
  );
}
