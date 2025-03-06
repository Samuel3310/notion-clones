import LiveBlockProvider from "@/components/LiveBlockProvider";
import React, { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
};

export default PageLayout;
