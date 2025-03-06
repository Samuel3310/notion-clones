import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";

const DocLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) => {
  const { id } = await params;
  auth.protect();
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
