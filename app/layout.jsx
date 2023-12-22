"use client";
import "./globals.css";

import { AppContextWrapper } from "./AppContextWrapper";

// export const metadata = {
//   title: "myFlavour - by Fimiar",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {


  
  return (
    <html lang="en">
      <body>
        <AppContextWrapper>{children}</AppContextWrapper>
      </body>
    </html>
  );
}