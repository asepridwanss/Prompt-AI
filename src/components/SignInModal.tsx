// components/SignInModal.tsx
"use client";

import SignIn from "./SignIn";

const SignInModal = () => {
  return (
    <div className="fixed w-full h-full bg-black/80 left-0 top-0 flex items-center justify-center z-50">
      <SignIn />
    </div>
  );
};

export default SignInModal;
