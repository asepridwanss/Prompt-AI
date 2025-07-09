import { auth } from "@/auth";
import SignOut from "./SignOut";

const Header = async () => {
  const session = await auth();
  return (
    <div className="flex items-center justify-between m-2.5 h-10 pl-2 pr-12 absolute w-full top-0 left-0">
      <div>
        
      </div>

      <div className="flex items-center gap-3">
        {/* <ModeToggle /> */}
        {session?.user && (
            <SignOut />
        )}

      </div>
    </div>
  );
};

export default Header;
