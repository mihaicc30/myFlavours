"use client";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../AppContextWrapper";
import { useRouter } from "next/navigation";

export default function NonExistantPage() {
  const { push } = useRouter();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) push(`/profile/${user?.uid}`);
  }, [user, push]);

  if (!user) return;
  return null;
}
