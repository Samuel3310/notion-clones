"use client";

import { useOthers, useMyPresence } from "@liveblocks/react/suspense";
import { PointerEvent, ReactNode } from "react";
import FollowPointer from "./FollowPointer";

const LiveCursorProvider = ({ children }: { children: ReactNode }) => {
  const [presence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  };
  const handlePointerLeave = () => {
    updateMyPresence({ cursor: { x: 0, y: 0 } });
  };
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others
        .filter((other) => other.presence.cursor !== null)
        .map((user) => (
          <FollowPointer
            key={user.connectionId}
            info={user.info.info}
            x={user.presence.cursor.x}
            y={user.presence.cursor.y}
          />
        ))}
      {children}
    </div>
  );
};

export default LiveCursorProvider;
