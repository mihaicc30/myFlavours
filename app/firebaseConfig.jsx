// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, FacebookAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn-pJrwEbeIUepnZJ4QX14mUvikAQkaH0",
  authDomain: "culinary-fimiar.firebaseapp.com",
  projectId: "culinary-fimiar",
  storageBucket: "culinary-fimiar.appspot.com",
  messagingSenderId: "887648789035",
  appId: "1:887648789035:web:77ac63776e0bb85421806e",
  measurementId: "G-8QJELRFJRX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Check if user exists in Firestore
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const docs = await getDocs(q);
    if (docs.docs.length < 1) {
      // Add user to Firestore if not already exists
      const newUserRef = await addDoc(collection(db, "users"), {
        id: new Date().getTime(),
        displayName: user.displayName,
        username: user.displayName,
        email: user.email,
        faved: {},
        recentlyViewed: [],
        avatar: user.photoURL || "",
        date: new Date().getTime(),
      });
      console.log("User does not exists in Firestore. New user added with ID: ", newUserRef.id);
    } else {
      console.log("User already exists in Firestore. No updates needed.");
    }
    console.log("Popup is successfull. Proceeding...");
  } catch (error) {
    if (error == "FirebaseError: Firebase: Error (auth/popup-closed-by-user).") console.log("User closed login popup.");
  }
};

const logOut = async() =>{
  await signOut(auth);
}

export { db, signInWithGoogle, auth, app, logOut };
