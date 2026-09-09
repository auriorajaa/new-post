"use client";

import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren;

const DesktopNavbar = ({ children }: Props) => {
  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto flex h-18 max-w-7xl items-center px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </nav>
  );
};
export default DesktopNavbar;
