"use client";
import React, { ReactNode } from "react";
import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";

const RoomProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{ cursor: { x: 0, y: 0 } }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider> {children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
};

export default RoomProvider;
