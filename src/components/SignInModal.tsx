// components/SignInModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignIn from "./SignIn";

const SignInModal = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    router.push("/"); // bisa diarahkan ke halaman lain
  };

  if (!showModal) return null;

  return (
    <div className="fixed w-full h-full bg-black/80 left-0 top-0 flex items-center justify-center z-50">
      <SignIn onClose={handleClose} />
    </div>
  );
};

export default SignInModal;
