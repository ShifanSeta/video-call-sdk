import React, { ReactNode } from "react";
import { StreamVideoProvider } from "../../../providers/StreamClientProvider";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Video-Call SDK",
  description: "Video Calling App",
  icons:{
    icon: '/icons/logo.svg'
  }
};
const RootLayout = ({ children }: { children: ReactNode }) => {
  
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
