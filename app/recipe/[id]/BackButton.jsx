import React from "react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const { push } = useRouter();
  const handleGoBack = () => {
    push("/dashboard");
  };
  return (
    <button className={`py-4 px-6 z-50 bg-white border-2 rounded-full absolute m-3`} onClick={handleGoBack}>
      ◀
    </button>
  );
}
