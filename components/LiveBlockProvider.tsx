"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

const LiveBlockProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const key = process.env.NEXT_PUBLIC_LIVE_BLOCK_KEY;

  useEffect(() => {
    if (key) {
      setPublicKey(key);
    } else {
      console.error(
        "Environment variable NEXT_PUBLIC_LIVE_BLOCK_KEY is not set."
      );
    }
  }, [key]);

  if (!publicKey) {
    return null; // Render nothing until the public key is set
  }

  return (
    <LiveblocksProvider authEndpoint="/auth-endpoint" throttle={16}>
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlockProvider;
