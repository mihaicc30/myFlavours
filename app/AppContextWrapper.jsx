"use client";
import { Suspense, createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth, logOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
export const AppContext = createContext();

export function AppContextWrapper({ children }) {
  // const zzz = useAuthState(app);
  const [contextValues, setContextValues] = useState({
    user: false,
  });
  // const [contextValues, setContextValues] = useState("aaaaaaaa");

  const updateContext = (newValues) => {
    setContextValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log("TCL:user", contextValues.user?.uid, user?.uid, contextValues.user?.uid === user?.uid)
      if (auth.currentUser) {
        if (contextValues.user?.uid !== user.uid) {
          console.log("updating user")
          updateContext({ user });
        } else {
          console.log("not updating user", "user the same")
        }
        // User is signed in
      } else {
        console.log("user is not auth")
        // User is signed out
        // updateContext({ user: null, isUser: false });
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, [contextValues]);

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

import { usePathname, useRouter } from "next/navigation";
import { SiCodechef } from "react-icons/si";
import { TbNavigationPin } from "react-icons/tb";
import { GiArchiveResearch } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import { MdLogout } from "react-icons/md";
import Link from "next/link";

function TopNav() {
  const { user, updateContext } = useContext(AppContext);
  const pathname = usePathname();
  const { push } = useRouter();

  const handleSignout = async() => {
    await logOut();
    updateContext({ user: false });
  };

  if (user)
    return (
      <>
        {pathname !== "/" && !pathname.startsWith("/recipe") && (
          <div className={`basis-[60px] bg-gradient-to-b from-[#cacaca] to-transparent flex flex-nowrap justify-between w-[100%] overflow-x-hidden`}>
            {/* <Link href="/" className="p-4 relative cursor-pointer text-3xl hover:text-4xl ">
            <TiThMenu className="transition-all absolute left-0" />
          </Link> */}
            <Link href="/dashboard" className={`flex flex-col pt-1 cursor-pointer select-none relative ml-2 `}>
              <h1 className="m-0 text-3xl text-center text-white py-1 px-4 rounded-lg logoC">myFlavour</h1>
              <h2 className="text-center bg-white rounded-lg leading-[1px] absolute top-[40px] left-[50%] -translate-x-[25%] whitespace-nowrap p-[7px] border-b-2">by Fimiar</h2>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/profile" className="relative flex cursor-pointer text-3xl hover:text-4xl ">
                {user.photoURL !== "" ? <img className="m-auto h-[40px] w-[40px] rounded-full" src={user.photoURL} alt="Chef Cat" /> : <SiCodechef className="transition-all absolute right-0" />}
              </Link>
              <Link href="/" onClick={handleSignout} className="p-4 relative cursor-pointer text-3xl hover:text-4xl ">
                <MdLogout className="transition-all absolute left-0" />
              </Link>
            </div>
          </div>
        )}
      </>
    );
}

function BotNav() {
  const { user } = useContext(AppContext);
  const pathname = usePathname();
  if (user)
    return (
      <>
        {pathname !== "/" && (
          <div className={`basis-[100px] bg-gradient-to-t from-[#cacaca] to-transparent flex flex-nowrap justify-evenly w-[100%] border-t-2 overflow-x-hidden`}>
            <Link href="/dashboard" className={`${pathname === "/dashboard" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex`}>
              <TbNavigationPin className={`${pathname === "/dashboard" ? " " : "grayscale opacity-40"} text-blue-600 transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
            </Link>
            {/* <span className="rounded-full h-[100%] w-[3px] bg-black/5"></span> */}
            <Link href="/favorites" className={`${pathname === "/favorites" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex`}>
              <FcLike className={`${pathname === "/favorites" ? "text-red-600 " : "grayscale opacity-40"} transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
            </Link>
            {/* <span className="rounded-full h-[100%] w-[3px] bg-black/5"></span> */}
            <Link href="/search" className={`${pathname === "/search" ? "morphx" : ""} basis-[32%] my-2 relative cursor-pointer text-3xl hover:text-4xl flex`}>
              <GiArchiveResearch className={`${pathname === "/search" ? " " : "grayscale opacity-40"} text-orange-600 transition-all absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]`} />
            </Link>
          </div>
        )}
      </>
    );
}