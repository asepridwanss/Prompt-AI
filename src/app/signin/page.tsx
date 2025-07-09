// app/signin/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInModal from "@/src/components/SignInModal";

const SignInPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignInModal />;
};

export default SignInPage;
