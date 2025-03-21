// "use client";

// import { db } from "@/firebase";
// import { doc } from "firebase/firestore";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";
// import { useCollection } from "react-firebase-hooks/firestore";

// const SidebarOption = ({ href, id }: { href: string; id: string }) => {
//   const [data, loading, error] = useCollection(doc(db, "documents", id));
//   const pathname = usePathname();
//   const isActive = href.includes(pathname) && pathname !== "/";

//   if (!data) return null;
//   return (
//     <Link
//       href={href}
//       className={` border p-2 rounded-md ${
//         isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
//       }`}
//     >
//       <p className="truncate">{data.title}</p>
//     </Link>
//   );
// };

// export default SidebarOption;

"use client";

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  if (loading) return null;
  if (error) return <p>Error loading document</p>;
  if (!data) return null;

  return (
    <Link
      href={href}
      className={`block rounded-md p-2 border  ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      <p className="">{data.title}</p>
    </Link>
  );
};

export default SidebarOption;
