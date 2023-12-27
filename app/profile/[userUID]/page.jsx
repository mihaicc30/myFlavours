import React from 'react'
import { getStaticUsers } from "@/app/CompsServer";
import ProfilePage from "./ProfilePage";

export async function generateStaticParams() {
  let userID = await getStaticUsers();
  return userID;
}

const Profile = ({ params }) => {
  return (
    <>
      <ProfilePage userID={params.userUID} />
    </>
  )
}

export default Profile