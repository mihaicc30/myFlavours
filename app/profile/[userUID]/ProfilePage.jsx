"use client";
import Link from "next/link";
import { db, logOut } from "@/app/firebaseConfig";
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

import { MdLogout } from "react-icons/md";
import { AppContext } from "../../AppContextWrapper";
import { TbChefHat } from "react-icons/tb";
import { SiCodechef } from "react-icons/si";
import { RiDeleteBin7Fill } from "react-icons/ri";
import CustomLoading from "../../CustomLoading";

export default function ProfilePage({ userID }) {
  const { user, updateContext } = useContext(AppContext);
  const displayNameTimerRef = useRef(null);
  const userNameTimerRef = useRef(null);
  const emailTimerRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const handleSignout = async () => {
    await logOut();
    updateContext({ user: false });
  };

  const handleDisplayNameChange = (e) => {
    const displayNameInputValue = e.target.value;

    // Clear existing timer
    clearTimeout(displayNameTimerRef.current);

    // Set a new timer to update after 2 seconds
    updateContext({ user: { ...user, displayName: displayNameInputValue } });
    displayNameTimerRef.current = setTimeout(async () => {
      const q = await query(collection(db, "users"), where("uid", "==", user.uid));
      const docx = await getDocs(q);
      const docRef = doc(db, "users", docx.docs[0].id);
      await updateDoc(docRef, { displayName: displayNameInputValue }, { merge: true });
    }, 1000);
  };

  const handleUsernameChange = (e) => {
    const usernameValue = e.target.value;

    // Clear existing timer
    clearTimeout(userNameTimerRef);

    // Set a new timer to update after 2 seconds
    updateContext({ user: { ...user, username: usernameValue } });
    userNameTimerRef.current = setTimeout(async () => {
      const q = await query(collection(db, "users"), where("uid", "==", user.uid));
      const docx = await getDocs(q);
      const docRef = doc(db, "users", docx.docs[0].id);
      await updateDoc(docRef, { username: usernameValue }, { merge: true });
    }, 1000);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;

    // Clear existing timer
    clearTimeout(emailTimerRef);

    // Set a new timer to update after 2 seconds
    updateContext({ user: { ...user, email: emailValue } });
    emailTimerRef.current = setTimeout(async () => {
      const q = await query(collection(db, "users"), where("uid", "==", user.uid));
      const docx = await getDocs(q);
      const docRef = doc(db, "users", docx.docs[0].id);
      await updateDoc(docRef, { email: emailValue }, { merge: true });
    }, 1000);
  };

  // Add cleanup function to clear timers when the component unmounts

  const deleteOldAvatar = async (img) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, img);
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    console.log("user->, ", user);
    try {
      await deleteOldAvatar(user.avatar);
      const storage = getStorage();
      let file = e.target.files[0];
      console.log("TCL: handleAvatarUpload -> file", file);

      if (file) {
        setUploading(true);
        const customFileName = `${Date.now()}_${file.name}`;

        const storageRef = ref(storage, `gs://culinary-fimiar.appspot.com/${customFileName}`);

        const compressedFile = await imageCompression(file, { maxSizeMB: 0.25 }); // Adjust the maxSizeMB as needed
        const metadata = {
          contentType: "image/jpeg",
        };

        // Upload the file to Cloud Storage
        await uploadBytes(storageRef, compressedFile, metadata);
        const downloadURL = await getDownloadURL(storageRef);

        updateContext({ user: { ...user, avatar: String(downloadURL) } });

        const q = await query(collection(db, "users"), where("uid", "==", user.uid));
        const docx = await getDocs(q);
        const docRef = doc(db, "users", docx.docs[0].id);
        await updateDoc(docRef, { avatar: String(downloadURL) }, { merge: true });

        setUploading(false);
      }
    } catch (error) {
      console.log(error.message);
      setUploading(false);
    }
  };

  const handleImageClick = () => {
    // Trigger the file input click
    document.getElementById("imageInput").click();
  };

  return (
    <Suspense fallback={<CustomLoading />}>
      {user && user.uid && (
        <div>
          <div className="flex flex-col mx-auto max-w-[800px]">
            <div className="grid grid-cols-2 justify-items-center px-[10vw] gap-4 mt-[5svh]">
              {user && (
                <Link
                  href={`/profile/${user.uid}/recipes`}
                  className="border-2 border-blue-400 hover:text-white active:text-white hover:bg-blue-400  active:bg-blue-400 rounded-xl w-[100%] h-[14svh] items-center flex flex-col justify-center relative cursor-pointer text-3xl hover:text-4xl transition"
                >
                  <TbChefHat className="transition-all " />
                  <p className="text-xs font-[600] text-center">Recipes</p>
                </Link>
              )}

              <Link
                href="/"
                onClick={handleSignout}
                className="border-2 border-orange-400 hover:text-white active:text-white hover:bg-orange-400  active:bg-orange-400 rounded-xl w-[100%] h-[14svh] items-center flex flex-col justify-center relative cursor-pointer text-3xl hover:text-4xl transition"
              >
                <MdLogout className="transition-all " />
                <p className="text-xs font-[600]">Logout</p>
              </Link>
            </div>

            <div className="group cursor-pointer relative flex flex-col text-center mt-[5svh] mx-[10vw] border-2 border-transparent hover:border-dashed hover:border-2 hover:border-inherit ">
              <p
                onClick={handleImageClick}
                className="absolute select-pointer opacity-0 group-hover:bg-gray-200/80 transition group-hover:opacity-[100%] flex justify-center items-center w-[100%] h-[100%] text-xl"
              >
                Upload new avatar
              </p>
              <input
                type="file"
                accept="image/*"
                id="imageInput"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              {user && user.avatar ? (
                <div className="w-[100%] flex justify-center items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-[auto] w-[120px] aspect-square origin-center rounded-full"
                    src={user.avatar}
                    alt="Chef"
                  />
                </div>
              ) : (
                <SiCodechef className="m-auto h-[100px] w-[100px] rounded-full my-4" />
              )}

              {uploading && (
                <div>
                  <CustomLoading />
                  Uploading...
                </div>
              )}
            </div>
            <div className="grid grid-cols-[1fr_3fr] max-md:grid-cols-[1fr_2fr] max-[480px]:max-md:grid-cols-1 justify-items-center px-[10vw] mt-[5svw]">
              <label
                htmlFor="displayName"
                className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
              >
                Display Name:
              </label>
              <input
                type="text"
                id="displayName"
                className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
                value={user.displayName}
                onChange={handleDisplayNameChange}
              />
            </div>
            <div className="grid grid-cols-[1fr_3fr] max-md:grid-cols-[1fr_2fr] max-[480px]:max-md:grid-cols-1 justify-items-center px-[10vw]">
              <label
                htmlFor="username"
                className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
                value={user.username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="grid grid-cols-[1fr_3fr] max-md:grid-cols-[1fr_2fr] max-[480px]:max-md:grid-cols-1 justify-items-center px-[10vw]">
              <label
                htmlFor="email"
                className="text-lg tracking-wide m-1 w-[100%] whitespace-nowrap"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                className="border-2 rounded-full my-1 py-1 px-4 w-[100%]"
                value={user.email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="grid grid-cols-1 justify-items-center px-[10vw] gap-4 my-[15svh]">
              {user && (
                <Link
                  href={`/profile/${user.uid}/recipes`}
                  className="border-2 border-red-400 hover:text-white active:text-white hover:bg-red-400  active:bg-red-400 rounded-xl w-[100%] max-w-[50svw] h-[14svh] items-center flex flex-col justify-center relative cursor-pointer text-3xl hover:text-4xl transition"
                >
                  <RiDeleteBin7Fill className="transition-all " />
                  <p className="text-xs font-[600] text-center">Delete account</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
