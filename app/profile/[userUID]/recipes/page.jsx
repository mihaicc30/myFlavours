import {getStaticUsers2, getUserRecipes } from "@/app/CompsServer";
import UserRecipess from "./UserRecipess";
import { Suspense } from "react";
import CustomLoading from "@/app/CustomLoading";

export async function generateStaticParams() {
  let userID = await getStaticUsers2();
  return userID;
}
export default function UserRecipesManagement({ params }) {
  return (
    <Suspense fallback={ <CustomLoading /> }>
      <UserRecipess key={crypto.randomUUID()} userUID={params.userUID} />
    </Suspense>
  )
}
