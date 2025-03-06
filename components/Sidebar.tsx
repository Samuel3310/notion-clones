"use client";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCollection } from "react-firebase-hooks/firestore";

import { MenuIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase-admin/firestore";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  roomId: string;
  userId: string;
  createdAt: string;
  role: "owner" | "editor";
}

const Sidebar = () => {
  const { user } = useUser();
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }

        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex flex-col py-4 max-w-36 space-y-4">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Documents found
          </h2>
        ) : (
          <>
            <h1>My Documents</h1>
            {groupedData.owner.map((doc, index) => (
              <div key={index}>
                <SidebarOption id={doc.id} href={`/doc/${doc.id}`} />
              </div>
            ))}
          </>
        )}
      </div>

      {groupedData.editor.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm">Share with me</h2>

          {groupedData.editor.map((doc, index) => (
            <SidebarOption key={index} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
        </>
      )}
    </>
  );

  return (
    <aside className="p-2 md:p-5 bg-gray-200 relative ">
      <div className="md:hidden inline">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetTitle className="text-center mb-2">Menu</SheetTitle>
            <SheetHeader>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:inline hidden">{menuOptions}</div>
    </aside>
  );
};

export default Sidebar;
