"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import BreadCrumbs from "./BreadCrumbs";

const Header = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <>
          {" "}
          <h1>
            {user?.firstName} {`'s `} Space
          </h1>{" "}
          <BreadCrumbs />
        </>
      )}

      <div className="text-black ">
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
